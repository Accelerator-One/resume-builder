// Package
package components;

// Dependencies
import java.util.*;

// Snake component
public class Snake {

    // snake body
    private Deque<Coords> chain = new ArrayDeque<Coords>();

    // intialize snake body of length 3
    public Snake() {
        chain.addFirst(new Coords(0, 0));
        chain.addFirst(new Coords(0, 1));
        chain.addFirst(new Coords(0, 2));
    }

    // fetch head
    public Coords getHead() {
        return chain.peek();
    }

    // relocate snake position
    public void relocate(Coords head) {
        chain.addFirst(head);
        chain.removeLast();
    }

    // increase length
    public void increase(Coords head) {
        chain.addFirst(head);
    }

    // return snake body
    public Deque<Coords> getSnake() {
        return chain;
    }

    // check if snake has bit it's body
    public boolean bodyPart(int x, int y) {

        boolean crash = false;
        Iterator<Coords> it = chain.iterator();

        while (it.hasNext()) {
            Coords curr = it.next();
            if (curr.x == x && curr.y == y)
                crash = true;
        }

        return crash;
    }

}
