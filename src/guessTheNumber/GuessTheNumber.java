package guessTheNumber;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Random;
import java.util.Scanner;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.text.DefaultCaret;

public class GuessTheNumber {

    private static final String EOL = System.lineSeparator();
    private static final JLabel GUESS_LABEL = new JLabel();
    private static final boolean[] INFOS = {true, true, false};
    private static final Random RANDOM = new Random();
    private static final int[] RESULTS = new int[6];
    private static final JCheckBox SUM_BOX = new JCheckBox("Sum", false);
    private static final JTextArea TEXT_AREA = new JTextArea(20, 30);
    private static final JTextField TEXT_FIELD = new JTextField(6);
    private static final String TITLE = "GuessTheNumber";
    private static int digits;
    private static boolean guessControl;
    private static int guessLimit;
    private static int guesses;
    private static int lowerLimit;
    private static int number;
    private static int sum;
    private static int upperLimit;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                TEXT_AREA.setTabSize(1);
                TEXT_AREA.setEditable(false);
                TEXT_AREA.setLineWrap(true);
                TEXT_AREA.setWrapStyleWord(true);
                ((DefaultCaret) (TEXT_AREA.getCaret())).setUpdatePolicy(DefaultCaret.ALWAYS_UPDATE);
                TEXT_FIELD.addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent event) {
                        String entered = TEXT_FIELD.getText();
                        TEXT_FIELD.setText("");
                        int guess;
                        try {
                            guess = Integer.parseInt(entered);
                        }
                        catch (NumberFormatException ex) {
                            TEXT_AREA.append(EOL + "Not a number.");
                            return;
                        }
                        if (("" + guess).length() != digits) {
                            TEXT_AREA.append(EOL + "Wrong number of digits.");
                        }
                        else if (checkDigits(guess)) {
                            TEXT_AREA.append(EOL + "Digits cannot repeat.");
                        }
                        else if ((findDigitsSum(guess) != sum && INFOS[2])) {
                            TEXT_AREA.append(EOL + "Wrong sum of digits.");
                        }
                        else {
                            checkNumber(guess);
                        }
                    }
                });
                JButton randomButton = new JButton("Random");
                randomButton.setMnemonic(KeyEvent.VK_R);
                randomButton.addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        int guess;
                        do {
                            guess = RANDOM.nextInt(upperLimit - lowerLimit + 1) + lowerLimit;
                        }
                        while (checkDigits(guess) || (findDigitsSum(guess) != sum && INFOS[2]));
                        checkNumber(guess);
                    }
                });
                JButton giveUpButton = new JButton("Give Up");
                giveUpButton.setMnemonic(KeyEvent.VK_G);
                giveUpButton.addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        TEXT_FIELD.setText("" + number);
                        exit();
                    }
                });
                JCheckBox posBox = new JCheckBox("Positions", true), bigSmallBox = new JCheckBox("Bigger Smaller", true);
                posBox.setMnemonic(KeyEvent.VK_P);
                posBox.addItemListener(new ItemListener() {
                    @Override
                    public void itemStateChanged(ItemEvent e) {
                        INFOS[0] = !INFOS[0];
                        TEXT_FIELD.requestFocusInWindow();
                    }
                });
                bigSmallBox.setMnemonic(KeyEvent.VK_B);
                bigSmallBox.addItemListener(new ItemListener() {
                    @Override
                    public void itemStateChanged(ItemEvent e) {
                        INFOS[1] = !INFOS[1];
                        TEXT_FIELD.requestFocusInWindow();
                    }
                });
                SUM_BOX.setMnemonic(KeyEvent.VK_S);
                SUM_BOX.addItemListener(new ItemListener() {
                    @Override
                    public void itemStateChanged(ItemEvent e) {
                        INFOS[2] = !INFOS[2];
                        updateSum();
                    }
                });
                JPanel configPanel = new JPanel(), inputPanel = new JPanel();
                configPanel.add(posBox);
                configPanel.add(bigSmallBox);
                configPanel.add(SUM_BOX);
                inputPanel.add(GUESS_LABEL);
                inputPanel.add(TEXT_FIELD);
                inputPanel.add(randomButton);
                inputPanel.add(giveUpButton);
                JFrame frame = new JFrame(TITLE);
                frame.add(configPanel, BorderLayout.PAGE_START);
                frame.add(new JScrollPane(TEXT_AREA), BorderLayout.CENTER);
                frame.add(inputPanel, BorderLayout.PAGE_END);
                frame.pack();
                frame.setLocationRelativeTo(null);
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.setVisible(true);
                start();
            }
        });
    }

    private static boolean checkDigits(int number) {
        int[] a = fillArray(number), b = new int[10];
        for (int i = 0; i < a.length; i++) {
            b[a[i]]++;
        }
        for (int i = 0; i < b.length; i++) {
            if (b[i] > 1) {
                return true;
            }
        }
        return false;
    }

    private static void checkNumber(int guess) {
        if (number == guess) {
            TEXT_AREA.append(EOL + guess + " is correct.");
            RESULTS[1] += guesses;
            RESULTS[4]++;
            if (guesses <= guessLimit && guessLimit != Integer.MAX_VALUE) {
                RESULTS[2] += guesses;
                RESULTS[5]++;
            }
            exit();
            return;
        }
        TEXT_AREA.append(EOL + guess + " is incorrect.");
        if (INFOS[0]) {
            int corrects = 0, incorrects = 0;
            int[] a = fillArray(guess), b = fillArray(number);
            for (int i = 0; i < a.length; i++) {
                if (a[i] == b[i]) {
                    corrects++;
                }
                for (int j = 0; j < b.length; j++) {
                    if (i != j && a[i] == b[j]) {
                        incorrects++;
                    }
                }
            }
            TEXT_AREA.append(EOL + "\t" + corrects + " in correct position, " + incorrects + " in incorrect position, " + (digits - corrects - incorrects) + " no match.");
        }
        if (INFOS[1]) {
            if (guess > number) {
                TEXT_AREA.append(EOL + "\tYour guess should be smaller.");
            }
            else {
                TEXT_AREA.append(EOL + "\tYour guess should be larger.");
            }
        }
        if (guessControl && guesses == guessLimit) {
            guessControl = false;
            int exit = JOptionPane.showConfirmDialog(null, "You reached the limit for your guesses. Do you want to continue anyway?", TITLE, JOptionPane.YES_NO_OPTION);
            if ((exit == 1) || (exit == -1)) {
                TEXT_FIELD.setText("" + number);
                exit();
                return;
            }
        }
        if (++guesses == guessLimit) {
            GUESS_LABEL.setText("LAST GUESS: ");
        }
        else {
            GUESS_LABEL.setText(guesses + ". GUESS: ");
        }
        TEXT_FIELD.requestFocusInWindow();
    }

    private static void exit() {
        RESULTS[0] += guesses;
        RESULTS[3]++;
        int exit = JOptionPane.showConfirmDialog(null, "Do you want to continue?", TITLE, JOptionPane.YES_NO_OPTION);
        if ((exit == 1) || (exit == -1)) {
            String s = "Total games: " + RESULTS[3];
            if (RESULTS[4] != 0) {
                s += EOL + "Total correct games: " + RESULTS[4];
            }
            if (RESULTS[5] != 0) {
                s += EOL + "Total correct games within the limit: " + RESULTS[5];
            }
            s += EOL + "Total guesses: " + RESULTS[0];
            if (RESULTS[1] != 0) {
                s += EOL + "Total correct guesses: " + RESULTS[1];
            }
            if (RESULTS[2] != 0) {
                s += EOL + "Total correct guesses within the limit: " + RESULTS[2];
            }
            s += String.format("%nAverage guesses: %.2f", 1.0 * RESULTS[0] / RESULTS[3]);
            if (RESULTS[4] != 0) {
                s += String.format("%nAverage correct guesses: %.2f", 1.0 * RESULTS[1] / RESULTS[4]);
            }
            if (RESULTS[5] != 0) {
                s += String.format("%nAverage correct guesses within the limit: %.2f", 1.0 * RESULTS[2] / RESULTS[5]);
            }
            TEXT_AREA.setText(s);
        }
        else {
            start();
        }
    }

    private static int[] fillArray(int number) {
        int[] a = new int[("" + number).length()];
        for (int i = 0; i < a.length; i++) {
            a[i] = number % 10;
            number /= 10;
        }
        return a;
    }

    private static int findDigitsSum(int number) {
        int n = 0;
        while (number > 0) {
            n += number % 10;
            number /= 10;
        }
        return n;
    }

    private static void start() {
        Scanner input = null;
        try {
            input = new Scanner(new File("GuessTheNumberConfiguration.ini"));
        }
        catch (FileNotFoundException ex) {
            JOptionPane.showMessageDialog(null, ex, TITLE, JOptionPane.ERROR_MESSAGE);
            System.exit(0);
        }
        lowerLimit = input.nextInt();
        input.nextLine();
        upperLimit = input.nextInt();
        input.nextLine();
        guessLimit = input.nextInt();
        input.close();
        if (guessLimit == 0) {
            guessLimit = Integer.MAX_VALUE;
        }
        guessControl = true;
        if (guessLimit != Integer.MAX_VALUE) {
            TEXT_AREA.setText("Guess the number between " + lowerLimit + " and " + upperLimit + " in " + guessLimit + " tries.");
        }
        else {
            TEXT_AREA.setText("Guess the number between " + lowerLimit + " and " + upperLimit + " in limitless tries.");
        }
        do {
            number = RANDOM.nextInt(upperLimit - lowerLimit + 1) + lowerLimit;
        }
        while (checkDigits(number));
        digits = ("" + number).length();
        sum = findDigitsSum(number);
        updateSum();
        guesses = 1;
        GUESS_LABEL.setText(guesses + ". GUESS: ");
        TEXT_FIELD.setText("");
    }

    private static void updateSum() {
        if (INFOS[2]) {
            SUM_BOX.setText("Sum: " + sum);
        }
        else {
            SUM_BOX.setText("Sum");
        }
        TEXT_FIELD.requestFocusInWindow();
    }
}