package sudoku.userinterface;

import javafx.event.EventHandler;
import javafx.geometry.Pos;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.Background;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.*;
import javafx.stage.Stage;
import javafx.scene.control.TextField;
import sudoku.constants.GameState;
import sudoku.problemdomain.Coordinates;
import sudoku.problemdomain.SudokuGame;
import java.util.HashMap;
import javafx.scene.paint.Color;

public class UserInterfaceImpl implements IUserInterfaceContract.View, EventHandler<KeyEvent> {


    private final Stage stage;
    private final Group root;

    private final HashMap <Coordinates, SudokuTextField> textFieldCoordinates;

    private IUserInterfaceContract.EventListener listener;

    private static final double WINDOW_X = 668;
    private static final double WINDOW_Y = 732;
    private static final double BOARD_PADDING = 50;
    private static final double BOARD_X_AND_Y = 576;

    private static final Color WINDOW_BACKGROUND_COLOR = Color.rgb(0,150,136);
    private static final Color BOARD_BACKGROUND_COLOR = Color.rgb(223,242,241);
    private static final String SUDOKU = "Sudoku";


    public UserInterfaceImpl(Stage stage, Group group) {
        this.stage = stage;
        this.root = group;
        this.textFieldCoordinates = new HashMap<>();
        initializeUserInterface();
    }

    private void initializeUserInterface() {

        drawBackground(root);
        drawSudokuBoard(root);
        drawTitle(root);
        drawTextField(root);
        drawGridLines(root);
        stage.show();
    }


    private void drawGridLines(Group root) {
        int xAndY = 114;
        int index = 0;
        while (index < 8) {
            int thickness;
            if (index == 2 || index == 5) {
                thickness = 3;
            } else {
                thickness = 2;
            }
            Rectangle verticalLine = getLine(
                    xAndY + 64 * index, thickness
            );
            Rectangle horizontalLine = getHorizontalLine(
                    xAndY + 64 * index, thickness
            );
            root.getChildren().addAll(
                    verticalLine,
                    horizontalLine
            );
            index++;
        }
    }

    private Rectangle getLine(double x, double width) {

        Rectangle line = new Rectangle();
        line.setX(x);
        line.setY(UserInterfaceImpl.BOARD_PADDING);
        line.setHeight(UserInterfaceImpl.BOARD_X_AND_Y);
        line.setWidth(width);

        line.setFill(Color.BLACK);
        return line;
    }

    private Rectangle getHorizontalLine(double y, double height) {

        Rectangle line = new Rectangle();
        line.setX(UserInterfaceImpl.BOARD_PADDING);
        line.setY(y);
        line.setWidth(UserInterfaceImpl.BOARD_X_AND_Y);
        line.setHeight(height);

        line.setFill(Color.BLACK);
        return line;
    }

    private void drawTextField(Group root) {
        final int xOrigin = 50;
        final int yOrigin = 50;

        final int xAndYDelta = 64;

        for (int xIndex = 0; xIndex < 9; xIndex++ ) {
            for (int yIndex = 0; yIndex < 9; yIndex++ ) {
                int x = xOrigin + xIndex * xAndYDelta;
                int y = yOrigin + yIndex * xAndYDelta;

                SudokuTextField tile = new SudokuTextField(xIndex, yIndex);

                styleSudokuTile(tile, x, y);
                tile.setOnKeyPressed(this);
                textFieldCoordinates.put(new Coordinates(xIndex, yIndex), tile);
                root.getChildren().add(tile);
            }
        }
    }

    public void styleSudokuTile(SudokuTextField title, double x, double y) {
        Font numberFont = new Font(32);
        title.setFont(numberFont);
        title.setAlignment(Pos.CENTER);
        title.setLayoutX(x);
        title.setLayoutY(y);
        title.setPrefHeight(64);
        title.setPrefWidth(64);

        title.setBackground(Background.EMPTY);
    }
    private void drawSudokuBoard(Group root) {
        Rectangle boardBackground = new Rectangle();
        boardBackground.setX(BOARD_PADDING);
        boardBackground.setY(BOARD_PADDING);

        boardBackground.setWidth(BOARD_X_AND_Y);
        boardBackground.setHeight(BOARD_X_AND_Y);
        boardBackground.setFill(BOARD_BACKGROUND_COLOR);

        root.getChildren().addAll(boardBackground);
    }

    private void drawTitle(Group root) {
        Text title = new Text(235, 690, SUDOKU);
        title.setFill(Color.WHITE);
        Font titleFont = new Font(43);

        title.setFont(titleFont);
        root.getChildren().addAll(title);
    }

    private void drawBackground(Group root) {
        Scene scene = new Scene(root, WINDOW_X, WINDOW_Y);
        scene.setFill(WINDOW_BACKGROUND_COLOR);
        stage.setScene(scene);

    }
    @Override
    public void updateSquare(int x, int y, int input) {
        SudokuTextField tile = textFieldCoordinates.get(new Coordinates(x, y));

        String value = Integer.toString(input);
        if ( value.equals("0")) value = "";

        tile.textProperty().setValue(value);
    }

    @Override
    public void setListener(IUserInterfaceContract.EventListener listener) {
        this.listener = listener;
    }

    @Override
    public void updateBoard(SudokuGame game) {
        for (int xIndex = 0; xIndex < 9; xIndex++ ) {
            for ( int yIndex = 0; yIndex < 9; yIndex++) {
                TextField tile = textFieldCoordinates.get(new Coordinates(xIndex,yIndex));
                String value = Integer.toString(
                        game.getCopyOfGridState()[xIndex][yIndex]
                );
                if (value.equals("0")) value = "";
                tile.setText(value);
                if (game.getGameState() == GameState.NEW) {
                    if (value.isEmpty()) {
                        tile.setStyle("-fx-opacity: 1;");
                        tile.setDisable(false);
                    } else {
                        tile.setStyle("-fx-opacity: 0.8;");
                        tile.setDisable(true);
                    }
                }
            }
        }
    }

    @Override
    public void showDialog(String message) {
        Alert dialog = new Alert(Alert.AlertType.ERROR, message, ButtonType.OK);
        dialog.showAndWait();
    }

    @Override
    public void showError(String message) {
        Alert dialog = new Alert(Alert.AlertType.ERROR, message, ButtonType.OK);
        dialog.showAndWait();
    }

    @Override
    public void handle(KeyEvent event) {
        if ( event.getEventType() == KeyEvent.KEY_PRESSED) {
            if (event.getText().matches("[0-9]")) {
                int value = Integer.parseInt(event.getText());
                handleInput(value, event.getSource());
            } else if ( event.getCode() == KeyCode.BACK_SPACE) {
                handleInput(0,event.getSource());
            } else {
                ((TextField)event.getSource()).setText("");
            }
        }
    }

    private void handleInput(int value, Object source) {
        listener.onSudokuInput(
                ((SudokuTextField) source).getX(),
                ((SudokuTextField) source).getY(),
                value

        );
    }
}
