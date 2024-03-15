---
title: "Idiot's guide to resource migration in Terraform"
date: 2024-03-15T12:21:46+01:00
draft: false
author: "Edwin Wenink"
tags: ['terraform', 'infrastructure as code', 'programming']
series: ['programming']
toc: true
---

Sometimes we need to migrate resources that are managed in Terraform.
Terraform is a declarative language to manage cloud infrastructure from code, which allows you to reliably automate your deployments and put your infrastructure configuration under version control.
We call this Infrastructure as Code (IaC).

When moving resources in your IaC, Terraform will by default delete the resource and re-create it at the new path.
In the best case this is relatively harmless, depending on whether some downtime is acceptable, but nevertheless wasted effort because we already know the recreated resource will be identical to the removed resource.
Worst case, we absolutely do not want to delete and recreate the resource, for example because it holds data (think: storage accounts, databases).
Another reason you do not want to recreate resources is if they use on system-assigned identities for connecting to other resources (role-based access that is tied to the lifecycle of the resource itself).
In that case, recreating the resource will likely break functionality.

So how do we *properly* migrate cloud resources managed by Terraform?
Properly means that Terraform will update its pointer to the remote resource and that the remote resource itself remains unaffected.
There are various scenarios in which you need to migrate Terraform resources:

- A. Moving resource blocks within the same Terraform state, for example to a child module.
- B. Moving a resource block to another module altogether, for example because over time you have developed dependency cycles and refactoring is overdue.
- C. Removing a resource from Terraform management altogether without deleting the resource.
- D. Bring an existing resource under Terraform management without Terraform trying to create a resource that already exists

Scenario A and B are the most interesting scenarios.
In particular scenario B is a superset of scenarios C and D, so they are discussed in one go.

## Scenario A: moving resources within the same Terra form state

- Make the refactor in your IaC
- In a Terraform plan, observe which resources are deleted and then recreated at the new path
- For each resource, define a `moved` block.
  * You can do this in a separate file, or keep the `moved` blocks next to the moved resource.
- Verify that in the final Terraform plan there are no creations and deletions. If there are in-place updates, verify that they are intended.
  * For example, if you accidentally import the right resource but from the wrong subscription (for example your staging environment instead of your dev environment) this may show up as an in-place update, depending on if that particular field forces replacement for that given resource.

After moving, it is optional to keep the move statements around.
I tend to keep them around until everything has been working great for a while, because the `moved` blocks are essentially an explicit history of how you manipulated the Terraform state.

## Scenario B: moving a resource to another Terraform state

This scenario is a lot more tricky!
This is because a failure to correctly remove blocks from the Terraform state will *trigger deletion* of those resources.

Always carefully inspect your plans before applying anything.

In this example, we will move one resource from module A to module B.
Module A and B each have their own backend and Terraform state.

1. Remove the resource from the IaC of module A
2. Record this removal with a `removed` block (available since Terraform 1.7+ )
  * Prior to Terraform 1.7, this requires you to manually run `terraform state rm`
3. Include the resource in the IaC of module B
4. Record an `import` block that maps the existing resource to the new location
block that maps the existing resource to the new location
5. Ensure that the Terraform plan for *both modules* do not include deletions and creations. Carefully inspect possible in-place updates and ensure they are innocent.
    * An innocent example of an in-place update is capitalization in a resource group name if the resource name is case insensitive.

## What can go wrong?

### Importing without removing

A lot of extra complexity arises from the fact that during your refactor, your teammates will probably happily keep on working in another branch.
During the migration, it is absolutely necessary to communicate this with teammates and do not make any other infra changes in the same Terraform states in the meantime.

We have to deploy module A first because it contains fundamental resources (such as networking: VNets, subnets, endpoints) that all subsequent modules depend on.
So the deployment order is: `A -> B`

Let's consider two scenarios.

1. Migrate a resource from A to B
2. Migrate a resource from B to A

Let's say you migrate a resource *from module A to B*.
First you remove the resource block from the infrastructure as code.
If you forget to correctly remove the resource from the Terraform state with a `removed` block in A, applying the Terraform plan will delete the resource and then re-create it at B.
In this case you have *de facto* migrated, but if your resources contains data you have just messed up.

Let's say you migrate a resource *from module B to A*.
If you forget to make and inspect a Terraform plan for *all involved modules* and find out too late that your `removed` blocks from the Terraform state of B contain mistakes, you wil happily delete the resources that you have just imported in the state of A.
This scenario is even more nasty, because at the end of the pipeline you have not only possibly thrown away data or identities tied to that specific resources, but also end up without that resource altogether.
This requires manual intervention to fix.

### Do not apply IaC from different branches

When you are migrating resources from a refactoring branch, it's very important to communicate with your teammates when the actual migration starts in order to ensure nobody manipulates the Terraform states from another branch with different IaC.

Some important safeguards should be in place:

- The `main` branch is the single source of truth, do not deploy any infrastructure (except for your dev environment) from other branches. Enforce this in your deployment pipelines.
- In staging and production environments, *nobody* should be able to manually deploy infrastructure using a `terraform apply`, but nevertheless you may have forgotten to deactivate an older deployment pipeline that *can* apply changes and may automatically trigger. If the previous safeguard is in place you should nevertheless only be able to deploy from the main branch.

If these guardrails are in place, you can only mess up on the development environment.
For the sake of argument, let's think through what happens if multiple people apply different IaC on the development environment.

<figure style="width: 50%; margin-left: 20px; margin-bottom: 10px; float: right;">
<img src="https://upload.wikimedia.org/wikipedia/en/d/db/Hank_Schrader_S5B.png" alt="Hank" />
<figcaption>Hank, looking worried</figcaption>
</figure>

This is Hank.
Hank was living the good life and followed this migration guide.
In the `A -> B` scenario he is doing a dry run of his migration by applying the infra changes on the development environment before merging his IaC to the main branch and committing to the whole migration.

But now he found out that someone he thought he knew well is not who he seemed to be.
That persons is applying old IaC to the development environment and on top of that, is *breaking bad* completely because they didn't even check the Terraform plan before applying.
Now Hank is worried and wondering why his database disappeared on dev.

What happened?

Hank migrated a database from Terraform state B to state A on his development branch.
During his testing run on dev, he rolled out these changes.
Our bad guy rolls out the old IaC from another branch.
Terraform notices that there is a database in state A that is not in the IaC, so will happily generate a plan to throw away the database.

An optional guardrail is to use `data` blocks for resources that actually contain data, such as databases or critical storage accounts.
It depends really on whether you want to live dangerously or not:

> For believe me: the secret for harvesting from existence the greatest fruitfulness and greatest enjoyment is —- to live dangerously. - Friedrich Nietzsche

## Disaster recovery

Before doing a migration, make a backup of your terraform states.
You can use `terraform state pull` for this.

What do you do when things go wrong anyways?
At this point, you have to accept shit is FUBAR and that you have to make manual interventions without making further mistakes under stress.

Honestly, this is context dependent, but it's not as simple as just reverting the IaC changes and restoring the old Terraform state (you could use `terraform state push`, which has some safeguards built-in).
If things went bad, your infrastructure has probably changed so your old Terraform states are outdated.
If it's possible to recover deleted or changed infrastructure (e.g. if you have soft deletes and recovery procedures) to exactly match the old IaC, you could try to revert IaC changes and restore the old state to reach a point where you end up with a neutral Terraform plan.
The downside? Not only have you possibly thrown away data, you are back to square one with the migration.

Instead, I'd personally adopt a "fix forward" strategy: accept you messed up, make sure all resources are rolled out like they were supposed to, and make ad-hoc changes to the Terraform states using imports and removals.

## Some Terraform gotchas (as of March 2024)

To conclude, some gotchas I encountered during a migration I performed recently.

Import blocks still do not support the `count` keyword, but since recently they do support `for_each`.
Resources created with a count parameter are *indexed* with an integer value, like `azurerm_storage_account.storage_account[0]`.
This index *must* be numerical and cannot be a string.
If you have a high count (let's say 100) or the amount of resources is non-static because it depends on a variable that's different for each deployment environment, you do not want to manually type 100 import blocks.
What you want to do instead is create a list or mapping that you can pass to `for_each` such that you can create a numerical range.
You can pass a list to `for_each`, but this will implicitly create a map with identical keys and values.
Be careful with Terraform map objects, because the *key is always a string* even if you try to cast it to a number.
You will end up with `azurerm_storage_account.storage_account["0"]` and this will not work for obvious reasons.
Instead, just use the `range` function and use `each.value`.

Also don't forget to update to the latest Terraform version, because the  `for_each` argument to `import` and `removed` blocks are only available since 1.7.

Related notes:

- [Terraform migration guide](/zettelkasten/202403130820-terraform_migration_guide/)
