# Kata: Extreme OOP

## Object Calisthenics

A kata to push the OOP-ing to the max with Object Calisthenics.

> Calisthenics is a form of exercise consisting of a variety of movements which exercise large muscle groups, such as running, standing, grasping, pushing, etc.
> > https://en.wikipedia.org/wiki/Calisthenics

The OOP we are going to do will be governed by some very strict rules:

1. Use only one level of indentation per method
1. Don't use the else keyword
1. Wrap all primitives and strings
1. Use only one dot per line
1. Don't abbreviate
1. Keep all entities small
1. Don't use any classes with more than two instance variables
1. Use first-class collections
1. Don't use any getters/setters/properties

You can [read more here](http://www.marcusoft.net/2010/01/trying-coding-dojo-kata-and-extreme-oop.html) or [here](https://markhneedham.com/blog/2008/11/06/object-calisthenics-first-thoughts/) and the [original description is here](http://milano-xpug.pbworks.com/f/10080616-extreme-oop.pdf).

## Explanation of the rules

First; don't question these rules. They are here to train you. You don't question the barbell, right?

### Use only one level of indentation per method

Like this:

```java
void collectRows(StringBuffer buffer) {
  for(int i = 0; i < 10; i++)
    doSomething(buf, i);
}
```

### Don’t use the else keyword

Ever. You may use an early return. Other techniques like polymorphism and null objects can help.

### Wrap all primitives and strings

No method should have an argument that is either a primitive type or a String.

### Use only one dot per line

The Pryce-McKinnon example: don’t do like this:

```java
dog.getBody().getTail().wag();
```

Do like this:

```java
dog.expressHappiness();
```

and let the implementation decide what this means.

### Don’t abbreviate

Try to keep method and class names to one or two words.

### Keep all entities small

No file longer than 50 lines, no package with more than 10 files.

### Don’t use any classes with more than two instance variables

Instead of doing this,

```java
class Name {
  String first;
  String middle;
  String last;
}
```

You may do this:
```java
class Name {
  Surname family;
  GivenNames given;
}
class Surname {
  String family;
}
class GivenNames {
  List names;
}
```

### Use first-class collections

If a class contains a collection, then it must be the only instance variable in that class.

### Don’t use any getters/setters/properties

Tell, don’t ask. Don’t meddle in the internals of other objects. If the other object has the data, then let the other object perform the operation.

## Kata

The actual kata can be any old kata, but we are going to use the Commodore 64 BASIC kata.


