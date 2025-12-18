package team.omok.omok_mini_project.repository;

import team.omok.omok_mini_project.domain.UserVO;
import team.omok.omok_mini_project.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {
    public UserVO findById(String login_id) {

        String sql = "SELECT login_id, user_pwd, nickname FROM users WHERE login_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, login_id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                UserVO vo = new UserVO();
                vo.setLoginId(rs.getString("login_id"));
                vo.setUser_pwd(rs.getString("user_pwd"));
                vo.setNickname(rs.getString("nickname"));
                return vo;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
