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

#### 3. 아래 명령어로 .env.example 파일을 복사해서 .env 파일을 업데이트 하세요.

```bash
cp .env.example .env
```

프로젝트를 실행시키기 위해서는 .env 파일에 아래 environment variables 들이 필요합니다.

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

#### 5. Generate the Prisma Client

```bash
npx prisma generate
```

#### 6. Start the server

```bash
yarn start
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

#### ❌오류❌ 터미널에 아래 문구가 뜬다면 서버에 접속이 실패 했습니다.

```
Server is not running
```

> #### 잠재 이슈
>
> - DB 연결문제.

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

## 구현한 API의 동작을 촬영한 데모 영상 링크

구현한 API 동작을 촬용한 데모영상입니다. [링크](https://drive.google.com/file/d/1S4pFplVBgGQ9Ax5zNlGZRVa--JAM2aso/view)

## 구현 방법 및 이유에 대한 간략한 설명

1. 사용자는 email,password 를 기입하여 회원가입 할수 있습니다. (email,validation 유효성 검사진행)
2. 사용자 는 로그인 할수 있습니다. (회원가입 처리가 된 email,password 기입)
3. 사용자 모두 게시판을 볼수있습니다.(pagination 기능 page,limit,order)(로그인 하지않아도 됩니다)
4. 사용자 모두 :id 게시글을 볼수있습니다 (로그인 하지않아도 됩니다)
5. 로그인한 사용자만 게시글을 생성 할수 있습니다(로그인 후 유효한 Bearer token 이 있어야합니다)
6. 로그인한 사용자만 게시글을 업데이트 할수 있습니다 (자신이 만든 게시글만 업데이트 가능합니다)
7. 로그인한 사용자만 게시글을 삭제 할수 있습니다 (자신이 만든 게시글만 삭제 가능합니다)

> #### express.js 사용
>
> - express.js는 간결하고 직관적인 API를 제공하여 웹 애플리케이션을 빠르게 구축할 수 있습니다.
>
> #### Prisma ORM 을 사용
>
> - 간편하고 생산적인 데이터베이스 접근 SQL 쿼리를 직접 작성하지 않고도 데이터베이스에 접근할 수 있습니다.
>
> #### argon2 사용
>
> - 사용자 비밀번호를 안전하게 저장하고 검증하기 위해 argon2를 선택하였습니다.

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

| Body       | Type     | Description                                                           |
| :--------- | :------- | :-------------------------------------------------------------------- |
| `page`     | `string` | **optional**. _[기본값 = 0]_ page 작성해줍니다.                       |
| `limit`    | `string` | **optional**. _[기본값 = 10]_ 몇개의 records를 가져오는지 결정합니다. |
| `orederBy` | `string` | **optional**. _[기본값 = asc]_ asc,desc (오름차순,내림차순)           |

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
--header 'Authorization: Bearer Token' \
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

```http
  GET /api/news/:id
```

예제 코드

```bash
curl http://localhost:8000/api/auth/news/:id
```

성공 | `Status 201`

```json
{
  "message": "User login successfully.",
  "token": "JWT TOKEN"
}
```

오류 | `Status 오류 상태 코드`
:id 에 입력한 값이 없으면 오류가 나옵니다.

```json
{
  "message": "오류 메시지 설명"
}
```

### PUT single 뉴스(게시판)

```http
  PUT /api/news/:id
```

요청 바디(request body)는 다음과 같은 필드를 포함해야 합니다:
<br/>
PUT 업데이트 요청이기 때문에 title,content 둘중하나는 반드시 기입해야합니다.
<br/>
모든 필드 누락되면 `title or content are required` **400** 에러가 발생합니다.

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
curl --request PUT http://localhost:8000/api/auth/news/:id \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer Token' \
--data-raw '{
    "title": "Title",
    "content": "Conetnet"
}'
```

성공 | `Status 200`

```json
{
	"data": {
		"id": id,
		"title": "update title",
		"content": "update content",
		"authorEmail": "user@email",
		"createdAt": "DATE TIME",
		"updatedAt": "DATE TIEM"
	},
	"message": "News updated successfully."
}
```

오류 | `Status 오류 상태 코드`

```json
{
  "message": "오류 메시지 설명"
}
```

### DELETE single 뉴스(게시판)

```http
  DELETE /api/news/:id
```

요청 헤더(request headers)는 다음과 같은 필드를 포함해야 합니다:

| Headers         | Type     | Description                                               |
| :-------------- | :------- | :-------------------------------------------------------- |
| `Authorization` | `string` | **Required**. `Bearer Token` 이 반드시 포암되어야 합니다. |

예제 코드

```bash
curl --request DELETE http://localhost:8000/api/auth/news/:id \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer Token' \
--data-raw '{
    "title": "Title",
    "content": "Conetnet"
}'
```

성공 | `Status 200`

```json
{
	"data": {
		"id": id,
		"title": "update title",
		"content": "update content",
		"authorEmail": "user@email",
		"createdAt": "DATE TIME",
		"updatedAt": "DATE TIEM"
	},
	"message": "News updated successfully."
}
```

오류 | `Status 오류 상태 코드`

```json
{
  "message": "오류 메시지 설명"
}
```
