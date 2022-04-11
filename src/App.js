import "./App.css";
import { useState } from "react";

let IMP = window.IMP;
IMP.init("imp60093857"); //가맹점 번호

//IMP.request_pay를 호출하기 전에 서버에서 데이터베이스에 주문 레코드를 생성하여 해당 레코드의 주문번호를 params.merchant_uid에 지정
//결제 프로세스 완료 수 해당 주문번호를 서버에서 조회하여 결제 위변조 여부를 검증하는데 필요

function App() {
  const [value, setValue] = useState({
    cardNumber: "",
    expiry: "",
    birth: "", //사업자 번호
    pwd2Digit: "",
    customer_uid: "gildong_0001_1234",
  });

  const { cardNumber, expiry, birth, pwd2Digit } = value;

  const onChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const requestPay = () => {
    IMP.request_pay(
      {
        // param
        pg: "html5_inicis",
        pay_method: "card", //결제 수단(필수)
        merchant_uid: "ORD20180131-0000012", //가맹점에서 생성/관리하는 고유 주문번호(필수)
        name: "노르웨이 회전 의자", //주문명
        amount: 100, //결제할 금액(필수)
        buyer_email: "totter@arcaneofficial.com",
        buyer_name: "홍길동",
        buyer_tel: "010-4209-2579", //주문자 연락처(필수)
      },
      (response) => {
        console.log(response, "response");
        if (response.success) {
          //결제 성공 시 로직,
          //결제 번호(imp_uid)와 주문번호(merchant_uid)를 서버에 전달
        } else {
          //결제 실패 시 로직
          alert("결제에 실패햐였습니다.error:" + response.error_msg);
        }
      }
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //서버에 빌링키 발급 요청
  };

  const requestKey = () => {
    IMP.request_pay(
      {
        pg: "html5_inicis.INIBillTst", // 실제 계약 후에는 실제 상점아이디로 변경
        pay_method: "card", // 'card'만 지원됩니다.
        merchant_uid: "order_monthly_0001", // 상점에서 관리하는 주문 번호
        name: "노르웨이 회전 의자", //주문명
        amount: 100, //결제할 금액(필수)
        customer_uid: "gildong_0001_1234", // 카드(빌링키)와 1:1로 대응하는 값
        buyer_email: "totter@arcaneofficial.com",
        buyer_name: "홍길동",
        buyer_tel: "010-4209-2579", //주문자 연락처(필수)
        m_redirect_url: "{모바일에서 결제 완료 후 리디렉션 될 URL}", // 예: https://www.my-service.com/payments/complete/mobile
      },
      (response) => {
        console.log(response, "빌링키 발급");
        if (response.success) {
          //빌링키 발급 성공
          //서버로 customer_uid보내기
        } else {
          //빌링키 발급 실패
          alert("결제에 실패하였습니다.error:" + response.error_msg);
        }
      }
    );
  };

  return (
    <div className="App">
      <h1>주문페이지</h1>
      <button onClick={requestPay}>일반 결제하기</button>
      <section>
        <h2>REST API정기결제</h2>
        <p>
          서버가 아임포트 REST API를 사용하여 아임포트 서버에 카드정보를
          전달하면, 아임포트 서버가 PG사의 API를 호출하여 빌링키를 발급
        </p>
        <form onSubmit={onSubmit}>
          <label>
            카드번호
            <input
              type="text"
              name="cardNumber"
              value={cardNumber}
              onChange={onChange}
            />
          </label>
          <label>
            카드 유효기간
            <input
              type="text"
              name="expiry"
              value={expiry}
              onChange={onChange}
            />
          </label>
          <label>
            생년월일
            <input type="text" name="birth" value={birth} onChange={onChange} />
          </label>
          <label>
            카드 비밀번호 앞 두자리
            <input
              type="text"
              name="pwd2Digit"
              value={pwd2Digit}
              onChange={onChange}
            />
          </label>
          <button style={{ alignSelf: "center" }}>정기 결제하기</button>
        </form>
      </section>

      <section>
        <h2>일반 결제창 정기결제</h2>
        <p>
          PG사가 제공하는 일반 결제창에 고객이 카드정보를 입력하여 빌링키를 발급
        </p>
        <button onClick={requestKey}>정기 결제하기</button>
      </section>
    </div>
  );
}

export default App;
