---
author: "Edwin Wenink"
title: "Object Orientation: Observer Pattern"
date: 2018-07-16
draft: false
tags: [Object Orientation, Design Pattern, Observer, Programming]
---

The observer pattern is a simple yet quintessential design pattern in object oriented programming. As programs become larger, objects multiply quickly, as do the interactions between them. For example, a class instance can be contained as an attribute in another class (composition), or be used by some method in another class (association). Sometimes these class relations are very simple and can be used without a second thought. But let's assume you have some class containing mutable information (the "subject" class) that is potentially relevant to a larger amount of other classes that observe the subject class.
Rather than constantly spamming the subject class to ask whether its information has changed, a lazy and efficient method is preferred: let the subject class keep track of all classes requiring its information and notify them that a change has been made.

Let's further assume that although we currently have some classes using this information, there could be more or less other observing classes in the future that we want to add. We could of course directly have the subject class contain instances on all observing classes and call methods on all these observers--a direct coupling between the subject and all its observers--but this makes the subject class more complicated than necessary and harder to maintain, as it needs to know about many different objects. This is where the observer pattern comes in. Rather than using this direct coupling to code the one-to-many dependency, we only require the subject class to inform its observers when a change to it is made, without having to specify what to do based on this change. The latter is best delegated to all the different observing classes themselves. Let's write up a quick and light-hearted example.

As I write this, the Nijmeegse Vierdaagse (the biggest walking event in the world) is going on, and alcohol flows freely through the streets. But of course, not everyone has a healthy relationship with alcohol. After drinking for seven days straight, a not to be specified person realizes he or she might have a problem and decides to see a therapist who starts to observe this person's behavior. 

First, we define the alcoholic:

```[Java]

import java.util.Observable;
import java.util.Observer;

public class Alcoholic extends Observable {
    private int beersDrank;
    private String name;
    
    public Alcoholic(String name, Observer therapist){
        beersDrank=0;
        this.name=name;
        addObserver(therapist);
    }
    
    public void drinkBeer(){
        beersDrank++;
        setChanged();
        notifyObservers();
    }
    
    public int getBeersDrank(){
        return beersDrank;
    }
    
    public String getName(){
        return name;
    }
}
```

We are speaking here of the cheap kind of alcoholic that only drinks beers. An alcoholic has some name that the therapist can ask for with a getter. Moreover, we keep track of how much beers the alcoholic drank. The Observer pattern is natively implemented in Java, so to use it we import the Observable class and extend it. Within the Observer pattern, this alcoholic is defined as the observable "subject" class. As said before, it only needs to keep track of its observers so it can notify when a relevant change has been made. In this case, we add a Therapist as an observer with `addObserver(new Therapist())`. A change to the internals of the alcoholic is made every time a beer is drank (poor liver), so that is the situation in which we notify the observers with `notifyObservers()`. Now we only need to define the observing Therapist:

```[Java]

import java.util.Observer;

public class Therapist implements Observer {

    int beersObserved;
    
    public Therapist(){
        beersObserved=0;
    }
    
    @Override
    public void update(Observable o, Object arg) {
        if (o.getClass()==Alcoholic.class && o !=null){
            Alcoholic aa = (Alcoholic) o;
            beersObserved++;
            System.out.println("Therapist says: " + aa.getName() + " you already had " + aa.getBeersDrank() + " beers. That's enough!");
        }
    }

    public int getBeersObserved(){
	return beersObserved;
    }
}
```

The therapist can observe multiple alcoholics in parallel and keeps track of the total amount of beers it has observed. Whenever an observed alcoholic drinks a beer and notifies its observer (the therapist in this case), the therapist knows it has to update its knowledge of the observed class. The Observer interface provides the update function that is called whenever the alcoholic calls the `notifyObservers()` function. It is possible that the therapist also observes other kinds of patients that are not alcoholics, so we need to distinguish what the therapist does for what kind of patient. In our case, we only care about alcoholics, but to be complete we still check the class of the object we observe to take the appropriate action. In this case we simply give the alcoholic a small preach every time he or she has a beer (probably not so effective, but hey I'm not a therapist myself). 

Let's test our code:

```[Java]

    public static void main(String[] args) {
        Therapist therapist = new Therapist();
        Alcoholic student1 = new Alcoholic("Student1",therapist);
        Alcoholic student2 = new Alcoholic("Student2",therapist);
        
        student1.drinkBeer();
        student2.drinkBeer();
        student1.drinkBeer();
        student1.drinkBeer();
        student2.drinkBeer();
        
        System.out.println("The therapist counted " + therapist.getBeersObserved()+" beers.");
    }
```

Which gives the output:

```
Therapist says: Student1 you already had 1 beers. That's enough!
Therapist says: Student2 you already had 1 beers. That's enough!
Therapist says: Student1 you already had 2 beers. That's enough!
Therapist says: Student1 you already had 3 beers. That's enough!
Therapist says: Student2 you already had 2 beers. That's enough!
The therapist counted 5 beers.
```

Although the Observer pattern is in essence simple, its importance cannot be overstated. It is for example very important in the MVC-architecture that advocates a separation between model, view, and controller. The controller can make adjustments to the model, containing the program logic, and various "view" classes designed to display the model need to be informed about updates in the model effectively without becoming entangled with the model. The observer pattern takes care of just that.


