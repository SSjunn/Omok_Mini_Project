package team.omok.omok_mini_project.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class Result {
    private int rank;
    private String id;
    private int rating;
    private int wins;
    private int loses;

    public Result(String id, int rating, int wins, int loses) {
        this.id = id;
        this.rating = rating;
        this.wins = wins;
        this.loses = loses;
    }

    public double getWinRate() {
        int totalGames = wins + loses;
        if(totalGames == 0) return 0.0;

        double rate = (double) wins / totalGames * 100;
        return Math.round(rate * 100) / 100.0;
    }

}
