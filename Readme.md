# Undertimes (키워드 기반 비주류 뉴스 제공 시스템)
> 기존의 온라인 뉴스 제공방식은 조회수를 기반으로 정렬되며 이러한 뉴스 노출 방식은 특정 이슈에 대해 과도한 재생산을 촉발하며 뉴스를 보는 사용자로 하여금 다양한 뉴스를 제공받지 못하게 하는 문제를 가진다. 이러한 문제점을 해결하기 위하여 뉴스 내용 분석을 통해 나온 키워드를 중심으로 상대적으로 적게 출현한 키워드가 있는 뉴스기사를 우선 제공하는 방법을 제안하고 해당 방법을 적용한 앱 프로토타입을 만든다. 제안 시스템은 뉴스 소비자에게 상대적으로 덜 이슈가 되는 뉴스들을 우선적으로 노출시키는 효과를 보였으며 이러한 현상은 기존의 뉴스 제공 방식이 가지던 다양성 부족의 문제도 함께 해결할 것으로 기대된다.
## 시스템 설계
### Backend
- ![image](https://user-images.githubusercontent.com/13795765/114340016-935f6d80-9b91-11eb-8608-3771afe8ec94.png)
- Back-End는 그림과 같이 크게 Docker, Load Balancer의 두 Layer로 구성된다. Docker Layer에는 크롤링 데이터를 저장하는 Database Container와 일정 주기마다 뉴스를 크롤링하는 News Crawler Container, 마지막으로 End User에 제공되는 Server Application Container로 구성된다. 그리고 Load Balancer Layer는 End User가 접속시 여러 서버로 분산시켜주는 역할을 한다. 

### Database
- News Crawler의 뉴스기사 정보와 키워드 분석데이터를 저장하고 서버 애플리케이션에서 이를 이용하기 위해 Database를 사용하였다. 데이터베이스 관리 시스템(DBMS)으로 오픈소스 관계형 데이터베이스(RDBMS)인 MariaDB를 사용하였다.

### News Crawler
- Unix기반 OS의 Job Scheduler인 Cron을 사용하여 5분주기로 네이버뉴스의 최신기사를 크롤링 하도록 구성하였다. 네이버 뉴스기사의 컨텐츠에서 한국어 형태소분석 라이브러리인 KoalaNLP (Komoran) 를 사용하여 형태소를 분석하고 TextRank알고리즘으로 추출한 상위 10개의 키워드와 뉴스제목과 URL, 이미지 URL을 Database에 저장한다.

### Server Application
- Server Application은 크게 두가지 역할을 한다. 첫번째로 Front-End페이지를 serving해준다. 이때 페이지를 Server Side Rendering(SSR)해주어 사용자에게 보이는 페이지가 보다 더 빠르게 로딩되도록 하고 검색엔진 색인 성능(SEO)을 높여, 특히 최신 뉴스 데이터에 대해 사용자 유입을 기대할 수 있다. 두번째로 Database에 저장된 뉴스기사와 키워드 정보를 이용해 비주류 뉴스 가중치를 계산해서 비주류 뉴스를 가져오는 GraphQL 기반 API를 제공한다.

### Load Balancer
- 서버 앱 컨테이너는 동일한 이미지를 여러 대로 나눠 사용하였고, Nginx를 사용하여 단일 도메인에 대해 사용자별로 서버의 여러 내부  포트로 랜덤 분산하여 단일 컨테이너가 처리해야 할 로직을 병렬로 처리할 수 있도록 구성하여 멀티코어 CPU의 장점을 살렸다. 현재 서버는 단일 PC에서 돌아가고 있지만, 추후 클라우드에 이 서비스를 올렸을 때 쿠버네티스와 같은 오케스트레이션 툴을 사용하거나 기타 컨테이너 단위로 서버를 관리할 수 있고 네트워크, CPU, 디스크의 부하 집중을 방지할 수 있을 것이다. 컨테이너마다 하는 일은 데이터베이스 조회 뿐이므로 동시성 이슈는 없을 것이고, 만약 크롤러를 여러 대 분산 운용하게 된다면, 크롤링하는 영역이나 주기를 적절히 배분해야한다. 또한 컨테이너(앱)의 업데이트가 발생할 필요가 있을 때, 무중단(Seamless)하게 전환되거나 유저군을 랜덤으로 나누어 일부만 업데이트 함으로써 변화 전후의 사용성을 동시에 파악할 수 있다.

### App Front-End
- 프로젝트 시연을 위해 필요한 프론트엔드 구성으로는 같은 앱 컨테이너에서 운영되는 웹 프론트엔드와 모바일 앱에서 확인 가능하도록 iOS로 개발하여 실제적으로 서비스 가능한 형태의 프로토타입을 만들었다. 웹 프론트엔드의 경우 같은 앱 컨테이너에 속해 있어서 데이터를 가져올 때, 적절한 설정을 거치면 보다 빠르게 데이터를 가져올 수 있고, 웹 뷰만으로는 많이 렌더링되는 뉴스 컨텐츠들을 보여주는 데 한계가 있어 네이티브 앱 프로토타입(iOS)을 만들었다.
- ![image](https://user-images.githubusercontent.com/13795765/114339916-598e6700-9b91-11eb-8e10-8f772307ca7e.png)
- 좀 더 편한 사용자 경험을 제공하기 위해 Native앱을 선택하였고 이를 위해 Swift를 이용하여 개발하였다. 기존의 UI 개발 방식과 다르게 빠른 View 렌더링을 위해 declarative user interface 방법을 채택 하였고 이를 위해 SwiftUI를 사용하였다. GraphQL은 Apollo와 Alamofire을 동시에 활용하고 있다. 

### Web Front-End
- 뉴스 데이터는 서버에게 Query 기반 질의를 보내서 받아오는 데이터를 이용하여 REST API 대비 적은 HTTP Request로 네트워크 지연시간을 최소화하였다. 뉴스 카테고리별, 키워드별 (포함 혹은 제외)로 뉴스를 로드하거나, 키워드 추천 검색어를 불러올 수 있다. 때로는 유저가 특정 키워드로 검색한 것을 저장해 놨다가 나중에 다시 참고할 수도 있으므로 포함, 제외된 키워드는 URL로 관리하도록 하였고, 그 상태는 서로 동기화된다. UI는 React를 사용했으며 컴포넌트의 조합을 통해 구성되고, 빠른 프로토타이핑을 위해 Material-UI 오픈소스 라이브러리를 사용하였다. GraphQL 쿼리는 apollo-boost 오픈소스 라이브러리를 사용하여 Typescript와의 정규화를 이루었다.
- ![image](https://user-images.githubusercontent.com/13795765/114339993-804c9d80-9b91-11eb-8183-deaf6c039652.png)
- Web Front-End 시스템은 검색엔진 최적화와 초기 로딩 성능 향상을 위해 서버 사이드 렌더링을 채택하고 있으며, 추가적인 데이터가 필요할 때, 필요한 만큼의 데이터를 제공받아 성능 향상과 적은 네트워크 대역폭 사용을 유도한다. Browser에서 첫 Request시에는 뉴스 데이터와 App Container, 비즈니스 로직 등을 모두 포함한 내용을 한꺼번에 가져온다. 이후에 이용자가 Interaction할 때마다 필요한 추가적인 데이터를 서버에 요청하여 받아온 뒤 비즈니스 로직을 수행하고 UI를 업데이트한다. 기존 UI를 계속 Repaint하는 방식이므로 DOM을 업데이트하는 최적의 방법이 필요하다. React UI Library를 사용하여 State 변화에 따른 UI갱신을 최적화하였다.

## Usage

- Initialize database tables

  ```sh
  $ yarn typeorm schema:sync
  ```

- Running the development server

  ```sh
  $ yarn dev
  ```

- Build and running the production server

  ```sh
  $ yarn build && yarn start
  ```

## Using docker compose

- docker-compose.yml

  ```yml
  version: "3"

  services:
    db:
      image: mariadb
      restart: always
      environment:
        - MYSQL_ROOT_PASSWORD=[db password]
        - MYSQL_DATABASE=undertimes
        - TZ=Asia/Seoul
      command:
        [
          "mysqld",
          "--character-set-server=utf8mb4",
          "--collation-server=utf8mb4_unicode_ci",
        ]
      volumes:
        - ./data:/var/lib/mysql

    app:
      build: .
      restart: always
      depends_on:
        - db
      env_file:
        - ./prod.env
      ports:
        - 127.0.0.1:9000:9000

    crawl:
      build: .
      restart: always
      entrypoint: ["crond", "-f"]
      depends_on:
        - db
      env_file:
        - ./prod.env
  ```

- prod.env

  ```ini
  TYPEORM_CONNECTION=mysql
  TYPEORM_HOST=db
  TYPEORM_USERNAME=root
  TYPEORM_PASSWORD=[db password]
  TYPEORM_DATABASE=undertimes
  TYPEORM_ENTITIES=src/database/entity/*.ts
  TYPEORM_SUBSCRIBERS=src/database/subscriber/*.ts
  TYPEORM_MIGRATIONS=src/database/migration/*.ts
  TYPEORM_ENTITIES_DIR=src/database/entity
  TYPEORM_MIGRATIONS_DIR=src/database/migration
  TYPEORM_SUBSCRIBERS_DIR=src/database/subscriber
  TYPEORM_DRIVER_EXTRA={"charset":"utf8mb4"}
  ```
