const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveSearchHistory = async function (userIdx, PWWC) {

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    
    // color도 함께 출력 (Color)
    if (PWWC == 3){
      // Dao 쿼리문의 결과를 호출
      const colorHistoryResult = await searchDao.selectColorHistory(connection, userIdx, PWWC);
      // connection 해제
      connection.release();

      return colorHistoryResult;

    } else { // color는 출력하지 않음 (Place, Weather, Who)
      // Dao 쿼리문의 결과를 호출
      const PWWHistoryResult = await searchDao.selectPWWHistory(connection, userIdx, PWWC);
      // connection 해제
      connection.release();

      return PWWHistoryResult;
    }

  } catch (err){
    logger.error(`App - ootdDateCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


/*
exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};
*/