package team.omok.omok_mini_project.repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class RankingDAO {
    private PreparedStatement ps;
    private Connection conn;
    private DataSource dataFactory;


    String sql = "SELECT id rating win loses FROM Ranking where id = ? ";

}
