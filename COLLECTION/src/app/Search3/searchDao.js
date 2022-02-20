
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// API 15 : [PWWC] 검색 초기화면 보여주기 - Color 탭
async function selectColorHistory(connection, userIdx, PWWC) {
  const selectColorHistoryQuery = `
                SELECT History.index, content, color
                FROM History
                WHERE userIdx = ? AND PWWC = ? AND status = 'active'
                ORDER BY createAt DESC;
                `;
  const [historyRows] = await connection.query(selectColorHistoryQuery, [userIdx, PWWC]);
  return historyRows;
}

// API 15 : [PWWC] 검색 초기화면 보여주기 - Place, Weather, Who 탭
async function selectPWWHistory(connection, userIdx, PWWC) {
  const selectPWWHistoryQuery = `
                SELECT History.index, content
                FROM History
                WHERE userIdx = ? AND PWWC = ? AND status = 'active'
                ORDER BY createAt DESC;
                `;
  const [historyRows] = await connection.query(selectPWWHistoryQuery, [userIdx, PWWC]);
  return historyRows;
}

/*
// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                SELECT id, email, nickname 
                FROM UserInfo 
                WHERE id = ?;
                `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}
*/

module.exports = {
  selectColorHistory,
  selectPWWHistory
};
