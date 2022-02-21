
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
};

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
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Place
async function selectPlaceSuggestion(connection, suggestionKeywordParams) {
  const placeSuggestionQuery = `
                SELECT place
                FROM (SELECT place, createAt
                  FROM FixedPlace fixed
                  UNION
                  SELECT place, createAt
                  FROM AddedPlace added
                  WHERE added.userIdx = ?) AS UP
                WHERE INSTR(place, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(placeSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Weather
async function selectWeatherSuggestion(connection, suggestionKeywordParams) {
  const weatherSuggestionQuery = `
                SELECT weather
                FROM (SELECT weather, createAt
                  FROM FixedWeather fixed
                  UNION
                  SELECT weather, createAt
                  FROM AddedWeather added
                  WHERE added.userIdx = ?) AS UW
                WHERE INSTR(weather, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(weatherSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Who
async function selectWhoSuggestion(connection, suggestionKeywordParams) {
  const whoSuggestionQuery = `
                SELECT who
                FROM (SELECT who, createAt
                  FROM FixedWho fixed
                  UNION
                  SELECT who, createAt
                  FROM AddedWho added
                  WHERE added.userIdx = ?) AS UWH
                WHERE INSTR(who, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(whoSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Color
async function selectColorSuggestion(connection, suggestionKeywordParams) {
  const colorSuggestionQuery = `
                SELECT smallClass
                FROM (SELECT smallClass, createAt
                  FROM FixedClothes fixed
                  UNION
                  SELECT smallClass, createAt
                  FROM AddedClothes added
                  WHERE added.userIdx = ?) AS UC
                WHERE INSTR(smallClass, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(colorSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

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
  selectPWWHistory,
  selectPlaceSuggestion,
  selectWeatherSuggestion,
  selectWhoSuggestion,
  selectColorSuggestion
};
