// Package
package components;

// Dependencies
import java.util.*;

// Board component
public class Board {

    // board matrix
    private char[] a[];
    // snake object
    private Snake snake;
    // food object
    private Coords food;

    // utilities
    private Scanner sc = new Scanner(System.in);
    private String bound = "________________________________";

    // add food where snake body is not present
    private boolean updateFood() {

        // condition added to avoid infinite loop
        int count = 0;
        boolean condition = true;
        do {

            int x = (int) (Math.random() * 1000);
            int y = (int) (Math.random() * 1000);

            x %= 10;
            y %= 10;

            // System.out.println(x+" "+y);

            // check if generated coordinates are valid
            if (x >= 0 || y >= 0 || x < 10 || y < 10) {
                // check if coords are not part of snake body
                if (!snake.bodyPart(x, y)) {
                    // updated food cordinates
                    food = new Coords(x, y);
                    return true;
                }
            }

            count++;
            // preventing infinite recursion
            if (count >= 100)
                return false;

        } while (condition);

        return false;

    }

    // Initialize 10 X 10 board, snake-body and food
    public Board() {

        a = new char[10][10];
        for (int i = 0; i < 10; i++)
            for (int j = 0; j < 10; j++)
                a[i][j] = '.';

        snake = new Snake();
        food = new Coords(5, 5);

    }

    // utility function to print the board, snake and food
    private void printBoard() {

        // clean board
        cleanBoard();

        // add snake on board
        addSnake();

        // add food on board
        addFood();

        // print board
        System.out.println(bound);
        System.out.println();

        for (int i = 0; i < 10; i++) {
            System.out.print('|');
            for (int j = 0; j < 10; j++)
                System.out.print(" " + a[i][j] + " ");
            System.out.print('|');
            System.out.println();
        }

        System.out.println(bound);
        System.out.println("Make your next move: [w,a,s,d]");

    }

    // move validation + update snake body and food (if needed)
    private boolean makeMove(int x, int y) {

        Coords head = snake.getHead();
        x += head.x;
        y += head.y;

        // out of boundary
        if (x < 0 || y < 0 || x >= 10 || y >= 10) {
            System.out.println("Out of boundary!");
            return false;
        }

        // snake bites itself
        if (snake.bodyPart(x, y)) {
            System.out.println("Snake bit itself!");
            return false;
        }

        // update snake location
        if (food.x == x && food.y == y) {

            snake.increase(new Coords(x, y));
            boolean newFood = updateFood();

            if (!newFood) {
                System.out.println("Heavy ops detected, exiting!");
                return false;
            }

        } else
            snake.relocate(new Coords(x, y));

        return true;
    };

    // append food to board
    private void addFood() {
        a[food.x][food.y] = 'O';
    }

    // append snake body to board
    private void addSnake() {

        boolean head = true;
        Deque<Coords> q = snake.getSnake();
        Iterator<Coords> it = q.iterator();
        while (it.hasNext()) {
            Coords data = it.next();
            if (head) {
                a[data.x][data.y] = 'H';
                head = false;
            } else
                a[data.x][data.y] = '*';
        }

    }

    // clean board
    private void cleanBoard() {
        for (int i = 0; i < 10; i++)
            for (int j = 0; j < 10; j++)
                a[i][j] = '.';
    }

    // start snake game
    public void startGame() {

        char move = ' ';
        boolean validMove = true;

        // allow turns till moves are valid
        do {

            // print board (if valid)
            if (validMove)
                printBoard();

            // fetch next user move ['w','a','s','d']
            move = sc.next().charAt(0);

            // movement handler
            switch (move) {
                case 'w':
                    validMove = makeMove(-1, 0);
                    break;
                case 'a':
                    validMove = makeMove(0, -1);
                    break;
                case 's':
                    validMove = makeMove(1, 0);
                    break;
                case 'd':
                    validMove = makeMove(0, 1);
                    break;
                default:
                    System.out.println("Invalid move! Exiting...");
                    validMove = false;
            }

        } while (validMove);

        System.out.println("Game Over!");
    }
};
