const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// 디버그용 미들웨어 추가
app.use((req, res, next) => {
  console.log('\n=== 요청 받음 ===');
  console.log('URL:', req.url);
  console.log('쿼리:', req.query);
  next();
});

app.get('/api/news', async (req, res) => {
  try {
    // 요청 정보 자세히 출력
    console.log('\n=== 뉴스 API 요청 ===');
    console.log('전체 URL:', req.originalUrl);
    console.log('쿼리 문자열:', req.url.split('?')[1]);
    console.log('파싱된 쿼리:', req.query);
    console.log('검색어:', req.query.query);

    const query = req.query.query;
    
    if (!query) {
      console.log('검색어 누락 - 요청 데이터:', {
        url: req.url,
        query: req.query,
        headers: req.headers
      });
      return res.status(400).json({ 
        error: '검색어가 필요합니다.',
        receivedData: {
          url: req.url,
          query: req.query
        }
      });
    }

    console.log('뉴스 검색 시작:', query);

    const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
      headers: {
        'X-Naver-Client-Id': '3cl_o2OjDBi1ML4LKy4A',
        'X-Naver-Client-Secret': '6h1NZlRsmP'
      },
      params: {
        query: query,
        display: 15,
        sort: 'sim'
      }
    });
    
    console.log('검색 완료:', {
      검색어: query,
      결과수: response.data.items.length
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('API 오류:', error.message);
    res.status(500).json({ error: '뉴스 데이터 조회 실패' });
  }
});

// 실종아동 API 엔드포인트
app.get('/api/missing', async (req, res) => {
  try {
    console.log('\n=== 실종아동 API 요청 ===');

    const response = await axios.get('https://www.safe182.go.kr/api/lcm/findChildList.do', {
      params: {
        esntlId: '10000702',
        authKey: '63b59188da6b4012',
        rowSize: '20'
      }
    });
    
    console.log('검색 완료:', {
      결과수: response.data.length || 0,
      데이터: response.data
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('실종아동 API 오류:', error);
    res.status(500).json({ error: '실종아동 데이터 조회 실패' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n=== 서버 시작 ===');
  console.log(`포트: ${PORT}`);
  console.log('==================\n');
});