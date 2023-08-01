# Pre onboarding - backend

## 지원자의 성명

> 이 준 현

## 애플리케이션 실행 방법

#### 1. repository 복제

```bash
git clone https://github.com/everydaycono/pre-onboarding.git
```

#### 2. 패키지 설치

```bash
yarn install
```

#### 3. Copy the .env.example to .env and update the variables.

```bash
cp .env.example .env
```

To run this project, you will need to add the following environment variables to your .env file

```
DATABASE_URL
DATABASE_MYSQL_ROOT_PASSWORD
DATABASE_MYSQL_DATABASE
DATABASE_MYSQL_USER
DATABASE_MYSQL_PASSWORD
JWT_SECRET
```

#### 4. Migrate Database with Prisma

```bash
npx prisma generate
```

#### 3. Generate the Prisma Client

```bash
npx prisma generate
```

#### 5. Start the server

```bash
yarn dev
```

터미널에 아래 문구가 뜨는것을 볼수있습니다.
<br/>

```
Server is running on port 8000 now!
```

http://localhost:8000 을 접속하게 되면 아래 문구를 볼수있습니다.

```
Hello, World!
```

## 데이터베이스 테이블 구조

#### User Table

- **id**: INT 타입, <br/>
  기본 키(primary key)로 설정되고 자동으로 증가하는 숫자 값입니다.
- **email**: VARCHAR 타입, <br/>
  고유 제약 조건(unique constraint)이 적용된 문자열 필드로, 사용자의 이메일 주소를 저장합니다.
- **password**: VARCHAR 타입, <br/>
  문자열 필드로 사용자의 비밀번호를 저장합니다.
- **createdAt** : DATETIME 타입, <br/>
  현재 시간을 기본값으로 가지며, 사용자 레코드가 생성된 일시를 저장합니다.
- **updatedAt** : DATETIME 타입, <br/>
  해당 레코드가 업데이트된 일시를 저장합니다.

#### News Table

- **id** : INT 타입
- **title** : VARCHAR 타입,<br/>
  최대 길이가 100인 문자열 필드로 뉴스 제목(타이틀)을 저장합니다.
- **content** : VARCHAR 타입, <br/>
  최대 길이가 1000인 문자열 필드로 뉴스 내용(컨텐츠)을 저장합니다.
- **authorEmail**: VARCHAR 타입, <br/>
  User 테이블의 email 필드와 관련된 외래 키(foreign key)로서, 해당 뉴스의 작성자의 이메일 주소를 참조합니다.
- **createdAt** : DATETIME 타입, <br/>
- **updatedAt** : DATETIME 타입, <br/>

> User 테이블과 News 테이블 사이에는 authorEmail 필드를 통해 관계가 형성되어 있으며, <br/> 이를 통해 한 명의 사용자가 여러 개의 뉴스를 작성할 수 있습니다. <br/>

## API 명세(request/response 포함)

## auth

### 회원가입 (Signup)

```http
  POST /api/auth/signup
```

요청 바디(request body)는 다음과 같은 필드를 포함해야 합니다:

| Body       | Type     | Description                                                    |
| :--------- | :------- | :------------------------------------------------------------- |
| `email`    | `string` | **Required**. 이메일 유형이어야 합니다.                        |
| `password` | `string` | **Required**. 비밀번호는 최소 8글자, 최대 20글자 이어야합니다. |

예제 코드

```bash
curl http://localhost:8000/api/auth/signup \
--header "Content-Type: application/json" \
--data-raw '{
    "email": "test@test.com",
    "password": "password"
}'
```

성공 | `Status 201 OK`

```json
{
  "message": "User created account successfully."
}
```

오류 | `Status 오류 상태 코드`

```json
{
  "message": "오류 메시지 설명"
}
```

### 로그인 (Signin)

```http
  POST /api/auth/signin
```

요청 바디(request body)는 다음과 같은 필드를 포함해야 합니다:

| Body       | Type     | Description                                                    |
| :--------- | :------- | :------------------------------------------------------------- |
| `email`    | `string` | **Required**. 이메일 유형이어야 합니다.                        |
| `password` | `string` | **Required**. 비밀번호는 최소 8글자, 최대 20글자 이어야합니다. |

예제 코드

```bash
curl http://localhost:8000/api/auth/signin \
--header "Content-Type: application/json" \
--data-raw '{
    "email": "test@test.com",
    "password": "password"
}'
```

성공 | `Status 201 OK`

```json
{
  "message": "User login successfully.",
  "token": "JWT TOKEN"
}
```

오류 | `Status 오류 상태 코드`

```json
{
  "message": "오류 메시지 설명"
}
```

## news

### 뉴스(게시판) 리스트

```http
  GET /api/news
```

요청 바디(request body)는 다음과 같은 필드를 포함해야 합니다:

| Body       | Type     | Description                                           |
| :--------- | :------- | :---------------------------------------------------- |
| `page`     | `string` | **optional**. page 작성해줍니다.                      |
| `limit`    | `string` | **optional**. 몇개의 records를 가져오는지 결정합니다. |
| `orederBy` | `string` | **optional**. asc,desc (오름차순,내림차순)            |

예제 코드

```bash
curl 'http://localhost:8000/api/news?page=1&limit=10&orderBy=asc'
```

성공 | `Status 201`

```json
{
  "message": "User login successfully.",
  "token": "JWT TOKEN"
}
```

오류 | `Status 오류 상태 코드`

```json
{
  "message": "오류 메시지 설명"
}
```

### 뉴스(게시판) 생성

```http
  POST /api/news
```

요청 바디(request body)는 다음과 같은 필드를 포함해야 합니다:

| Body      | Type     | Description                                                               |
| :-------- | :------- | :------------------------------------------------------------------------ |
| `title`   | `string` | **Required**. 게시판의 title 입니다 (최소 2글자 최대 100글자 입니다).     |
| `content` | `string` | **Required**. 게시판의 content 입니다 (최소 2글자 최대 1000글자 입니다) . |

요청 헤더(request headers)는 다음과 같은 필드를 포함해야 합니다:

| Headers         | Type     | Description                                               |
| :-------------- | :------- | :-------------------------------------------------------- |
| `Authorization` | `string` | **Required**. `Bearer Token` 이 반드시 포암되어야 합니다. |

예제 코드

```bash
curl --request POST http://localhost:8000/api/auth/news \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer Token}' \
--data-raw '{
    "title": "Title",
    "content": "Conetnet"
}'
```

성공 | `Status 201`

```json
{
  "message": "User login successfully.",
  "token": "JWT TOKEN"
}
```

오류 | `Status 오류 상태 코드`

```json
{
  "message": "오류 메시지 설명"
}
```

### GET single 뉴스(게시판)

### PUT single 뉴스(게시판)

### DELETE single 뉴스(게시판)
