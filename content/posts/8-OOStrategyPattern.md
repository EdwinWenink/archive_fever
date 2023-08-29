---
author: "Edwin Wenink"
title: "Object Orientation: Strategy Pattern"
date: 2018-06-28
draft: false
tags: [Object Orientation, Design Pattern, Strategy, Programming]
series: ['Programming']
---

In object-oriented programming classes tend to multiply quickly. Luckily, some design patterns are available to solve commonly occurring issues. In this post I want to quickly illustrate the strategy pattern with an easy example written in Java. To make it intuitively clear why this pattern is called the 'strategy' pattern, let's sketch a situation in which the application of different strategies is important: a game.

Without getting lost in the philosophical details of what constitutes a game, we can safely assume a game at least needs players. So let's make a Player class. We want a player to have a name, a team, and a game strategy:

```java
public class Player {

    private String name;
    private Team team;
    private Strategy strategy;

    public Player(String name, Team team, Strategy strategy){
        this.name=name;
        this.team=team;
        this.strategy=strategy;
    }

    public String yell(){
        return this.name+" yells: "+team.yell();
    }

    public void changeTeam(){
        this.team=team.other();
    }

    public String getName(){
        return this.name;
    }

    public Team getTeam(){
        return this.team;
    }

    public String getStrategy() {
        return this.name+"'s strategy: "+this.strategy.sayStrategy();
    }

    public void setStrategy(Strategy strategy) {
        this.strategy=strategy;
    }
}
```

This class definition requires us to define at least two other classes, one for defining what a team is and another for determining the player strategy. Let us assume that for this particular imaginary game (we haven't defined any actual rules), there are only two teams per game: a blue and a red team. Since blue and red are the only possible team instances, we can use an enumeration type. For some reason each team has an incredibly silly yell:

```java
public enum Team {
    RED,BLUE;
    public String yell(){
        switch (this) {
            case RED: return "We are the red devils!";
            case BLUE: return "Blue is the color of righteousness!";
            default: return "";
        }
    }
}
```

Now the strategy pattern comes into play. We want each player to potentially have a different game strategy. A naive solution would be to create different player classes. We could have one class called *CheatingPlayer* and one class called *FairPlayer* and so on for all potential strategies. However, each of these classes will have the exact same code except for the code defining the strategy. Unnecessary code duplication must always be avoided. If you for example want to change some characteristic of the player, you would have to edit all duplicate code in all these classes. The strategy pattern solves this issue.

As we saw, we have a single *Player* class that has a *Strategy* as an attribute, but other than this we do not specify yet what particular strategy. The player could have whatever strategy, the only obligation we make now is that it has one. The solution is to make *Strategy* an interface defining what obligations each particular strategy should fulfill. Normally a strategy should have some influence on the player's behavior in the game, but since we don't program the game itself to keep it simple, we just want players to state their strategy when asked:

```java
public interface Strategy {
    public String sayStrategy();
}
```

Each particular strategy has to define which String this function returns. For simplicity, let's assume for now there are two particular strategies implementing the *Strategy* interface, one where we intend to cheat, and one where we will play fairly (whatever that means):

```java
public class CheatingStrategy implements Strategy {

    @Override
    public String sayStrategy() {
        return "Sedating the enemy team with horse tranquilizer";
    }
}
```
```java
public class FairStrategy implements Strategy {

    @Override
    public String sayStrategy() {
        return "Shaking hands, wishing the opponent good luck (because they need it)";
    }

}
```

We can create as many strategies as we see fit, and our problem is solved: each player can have a different strategy without having to define multiple player classes with duplicate code. Let's see how it works:

```java
public class StrategyPattern {
    public static void main(String[] args) {

        Strategy cheating = new CheatingStrategy();
        Strategy fair = new FairStrategy();
        Player Edwin = new Player("Edwin",Team.BLUE,fair);
        Player Diablo = new Player("Diablo",Team.RED,cheating);
        System.out.println(Edwin.yell());
        System.out.println(Diablo.yell());
        System.out.println(Edwin.getStrategy());
        System.out.println(Diablo.getStrategy());
    }
}
```

The console output is:

>Edwin yells: Blue is the color of righteousness!\
>Diablo yells: We are the red devils!\
>Edwin's strategy: Shaking hands, wishing the opponent good luck (because they need it)\
>Diablo's strategy: Sedating the enemy team with horse tranquilizer
