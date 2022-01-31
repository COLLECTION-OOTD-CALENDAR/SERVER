
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}



// userId 회원 조회
// async function selectUserId(connection, userId) {
//   const selectUserIdQuery = `
//                  SELECT id, email, nickname 
//                  FROM UserInfo 
//                  WHERE id = ?;
//                  `;
//   const [userRow] = await connection.query(selectUserIdQuery, userId);
//   return userRow;
// }

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(name,nickname,ID,password,phoneNumber)
        VALUES (?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
// async function selectUserPassword(connection, selectUserPasswordParams) {
//   const selectUserPasswordQuery = `
//         SELECT email, nickname, password
//         FROM UserInfo 
//         WHERE email = ? AND password = ?;`;
//   const selectUserPasswordRow = await connection.query(
//       selectUserPasswordQuery,
//       selectUserPasswordParams
//   );

//   return selectUserPasswordRow;
// }

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
// async function selectUserAccount(connection, email) {
//   const selectUserAccountQuery = `
//         SELECT status, id
//         FROM UserInfo 
//         WHERE email = ?;`;
//   const selectUserAccountRow = await connection.query(
//       selectUserAccountQuery,
//       email
//   );
//   return selectUserAccountRow[0];
// }





//if가 만드는 로직~

//ID만 가져오는 함수
async function selectUserID(connection,ID) {
  const selectUserIDQuery = `
                  SELECT ID
                  FROM User
                  WHERE ID = ?;
                  `;
  const [IDRow] = await connection.query(selectUserIDQuery, ID);
  return IDRow;
}


//닉네임만 가져오는 함수
async function selectUsernickname(connection,nickname) {
  const selectUsernicknameQuery = `
                  SELECT nickname
                  FROM User
                  WHERE nickname = ?;
                  `;
  const [nicknameRow] = await connection.query(selectUsernicknameQuery, nickname);
  return nicknameRow;
}


//ID랑 PW 가져오는 함수
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT ID, password
        FROM User 
        WHERE ID = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}


//ID로 계정의 STATUS여부 확인 함수
async function selectUserAccount(connection, ID) {
  const selectUserAccountQuery = `
        SELECT status, ID
        FROM User
        WHERE ID = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      ID
  );
  return selectUserAccountRow[0];
}

//회원정보 수정 (닉네임) update 함수
async function updateUserInfo(connection, userIdx, nickname) {
  const updateUserQuery = `
  UPDATE User 
  SET nickname = ?
  WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, userIdx]);
  return updateUserRow[0];
}



module.exports = {
  selectUser,
  selectUserEmail,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  selectUserID,
  selectUsernickname,

};

