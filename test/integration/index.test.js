import request from 'supertest';
import express from 'express';
import app from '../../src/index';

// app.get('/user', function (req, res) {
//   res.status(200).json({ name: 'john' });
// });

describe('Wanted pre onboarding', () => {
  describe('GET /', () => {
    it('/ --> say hi', async () => {
      const res = await request(app).get('/').expect(200);
      expect(res.text).toBe('Hello, World!');
    });
  });

  describe('--News (게시판)--', () => {
    describe('GET  /api/news', () => {
      it('/ --> 게시판 GET 요청 200 성공', async () => {
        const res = await request(app).get('/api/news');

        expect(res.body).toMatchObject({
          count: expect.any(Number),
          totalCount: expect.any(Number),
          data: expect.arrayContaining([
            expect.objectContaining({
              authorEmail: expect.any(String),
              content: expect.any(String),
              createdAt: expect.any(String),
              id: expect.any(Number),
              title: expect.any(String),
            }),
          ]),
        });
      });
      it('/ --> 게시판 GET 요청 200 성공 pagination', async () => {
        expect().to;
        const res = await request(app)
          .get('/api/news')
          .query('page', 1)
          .query('limit', 10)
          .query('orederBy', 'asc');

        expect(res.body).toMatchObject({
          count: expect.any(Number),
          totalCount: expect.any(Number),
          data: expect.arrayContaining([
            expect.objectContaining({
              authorEmail: expect.any(String),
              content: expect.any(String),
              createdAt: expect.any(String),
              id: expect.any(Number),
              title: expect.any(String),
            }),
          ]),
        });
      });
      it('/ --> 게시판 GET 요청 pagination 요청 404 에러 (페이지가 너무 커서 찾는 데이터를 넘겼을 경우 오류 404)', async () => {
        expect().to;
        const res = await request(app)
          .get('/api/news')
          .query({ page: 999999999 }, { limit: 10 }, { orederBy: 'asc' })
          .expect(404);

        expect(res.body).toEqual({
          message: 'news not found.',
        });
      });
    });
    describe('GET  /api/news/:id', () => {
      it('/ --> :id 게시판 GET 요청 200 성공', async () => {
        expect().to;
        const res = await request(app).get('/api/news/1').expect(200);
        expect(res.body).toMatchObject({
          authorEmail: expect.any(String),
          content: expect.any(String),
          createdAt: expect.any(String),
          id: expect.any(Number),
          title: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
      it('/ --> :id 게시판 GET 요청 404 에러 (없는 게시판 GET 요청) ', async () => {
        expect().to;
        const res = await request(app).get('/api/news/999999').expect(404);

        expect(res.body).toEqual({
          message: 'News not found',
        });
      });
    });
    describe('POST /api/news', () => {
      it('/ --> 게시판 POST 요청 401 에러 ("Authentication Invalid)', async () => {
        const res = await request(app)
          .post('/api/news')
          .send({
            title: 'test title',
            content: 'test content',
          })
          .expect(401);

        expect(res.body).toEqual({ message: 'Authentication Invalid' });
      });
    });
    describe('PUT /api/news/:id', () => {
      it('/:id --> :id 게시판 PUT 요청 401 에러 ("Authentication Invalid)', async () => {
        const res = await request(app)
          .put('/api/news/1')
          .send({
            title: 'test title',
            content: 'test content',
          })
          .expect(401);

        expect(res.body).toEqual({ message: 'Authentication Invalid' });
      });
    });
    describe('DELETE /api/news/:id', () => {
      it('/:id --> :id 게시판 DELETE 요청 401 에러 ("Authentication Invalid)', async () => {
        const res = await request(app).delete('/api/news/1').expect(401);

        expect(res.body).toEqual({ message: 'Authentication Invalid' });
      });
    });
  });

  describe('--Auth --', () => {
    //10글자 랜덤 생성 (회원가입,로그인 테스트 를 위한 코드)
    const randomStringGenerate = () => {
      var result = '';
      var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < 10; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    const userEmail = randomStringGenerate();
    describe('POST /api/auth/signup', () => {
      it('/ --> user 회원가입 요청 400 에러 (요청 정보 password 누락)', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            email: 'test@email.com',
          })
          .expect(400);

        expect(res.body).toEqual({
          message: 'email and password are required.',
        });
      });
      it('/ --> user 회원가입 요청 400 에러 (요청 정보 email 누락)', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            password: 'password',
          })
          .expect(400);

        expect(res.body).toEqual({
          message: 'email and password are required.',
        });
      });
      it('/ --> user 회원가입 요청 400 에러 (요청 정보 email 형식 맞지않음)', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            email: 'test',
            password: 'password',
          })
          .expect(400);

        expect(res.body).toEqual({
          message: 'email is invalid.',
        });
      });
      it('/ --> user 회원가입 요청 400 에러 (요청 정보 password 최소 8글자 )', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            email: 'test@email.com',
            password: '1234',
          })
          .expect(400);

        expect(res.body).toEqual({
          message: 'password must be at least 8 characters.',
        });
      });
      it('/ --> user 회원가입 요청 201 성공 ', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            email: `${userEmail}@email.com`,
            password: 'password',
          })
          .expect(201);

        expect(res.body).toEqual({
          message: 'User created account successfully.',
        });
      });
      it('/ --> user 회원가입 요청 409 에러 (요청 정보 동일 email 경우,[email 이 이미 가입되어이있습니다.]) ', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            email: `${userEmail}@email.com`,
            password: 'password',
          })
          .expect(409);

        expect(res.body).toEqual({
          message: 'User already exists.',
        });
      });
    });

    describe('POST /api/auth/signin', () => {
      it('/ --> user 로그인 요청 200 성공 (회원가입한 userEmail 로 로그인)', async () => {
        const res = await request(app)
          .post('/api/auth/signin')
          .send({
            email: `${userEmail}@email.com`,
            password: 'password',
          })
          .expect(200);

        expect(res.body).toMatchObject({
          message: 'User login successfully.',
          token: expect.any(String),
        });
      });
    });
  });
});
