# SERVER



## 💡 Github Rules

#### ⚠ `master` branch : 병합 및 배포 용도 ⚠


### Branch

1. API 명세서를 참조하여 각 API의 기능마다 branch를 생성.
ex) ootd 최종 등록하기 / 기존 ootd 보여주기 / 회원 가입 등

2. API 명세서에 따른 기능을 구현 완료하고, 팀장에게 `Pull Request` 요청 시 팀장 ✨**이프**✨가 `Merge`

3. Branch 이름 규칙
맨 앞 글자 및 단어의 첫 글자를 대문자로 유지할 것.
ex) UpperCase



### Commit

#### ❗ Base Format ❗

`YYMMDD 유형(Type) :: 제목(subject)`

(Blank Line) : Commit 시 따옴표를 닫지 않고 엔터치면 개행 처리 가능.

`본문(body)` : 설명

ex)
```
git commit -m 
"220112 Fix :: Template 중 'userDao' 파일 내 sql 쿼리문 수정

sql 쿼리문 - 기존 작성 쿼리에서 트랜잭션 오류 발견 후 변경"
```

#### Rules for Format

1. 유형(Type) (종류 : 설명)
    - Feat : 새로운 기능 **추가**
    - Fix : 버그 **수정**
    - Build : 빌드 관련 파일 **수정**, 라이브러리 **추가/삭제** 등
    - Style : **스타일** (코드 형식, 코드 정렬, 세미콜론 추가 등 비즈니스 로직에 변경이 없는 경우)
    - Refactor : 코드 **리팩토링**(완전히 코드 구조 수정 경우)

2. 제목(Subject)
    - 제목은 30자를 넘기지 않고, **마침표를 붙이지 않음.**
    - 제목에는 commit 타입을 포함하여 작성함(ex. Feat - 추가, Fix - 수정 등)
    - 과거 시제 사용 X. **명령조**로 작성(ex. 사용(O) 사용함(X) 사용했음(X))
    - **제목과 본문은 한 줄 띄워 분리**
    - 제목의 첫 글자는 반드시 **대문자**

3. 본문(Body) (선택)
    - 선택사항. 최대한 적어주면 문제가 생겼을 때 commit 기록으로 확인하여 복구 가능.
    - **무엇을**, **왜**에 초점을 두어 작성.
    - 설명뿐 아니라, commit의 이유 작성 시에도 작성.
    - **API 명세서 또는 `baseResponse.js` 파일에 변동이 생길 경우에도 명시**
        * 해당 경우에는 책임자가 **어떠한 기능**을 작성 중에 API 명세서와 `baseResponse.js` 파일에
        **변경을 준다**는 것을 단체 카톡방에 알려준 후 개인적으로 진행.
    - 특정 사안에 대해 논의가 필요한 경우에도 작성.
