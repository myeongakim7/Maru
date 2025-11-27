<h1>마루는 강쥐 사전예약 홈페이지</h1>

<h2>PlUGIN</h2>
Slick, GSAP, Swiper

<h2>Page Description</h2>

<h3>페이지 별 애니메이션 실행</h3>
<img width="445" height="83" alt="image" src="https://github.com/user-attachments/assets/c3d5fd24-c6bb-462c-baf5-cae1cf6bf3df" /><br>
- 먼저 실행여부를 off 시켜두고 페이지 이동 시에 slick의 beforeChange 이벤트를 사용하여, 다음 슬라이드로 넘어갈 때 조건을 걸어주고 스위치처럼 gsap 애니메이션을 실행되게했다<br>
<img width="651" height="36" alt="image" src="https://github.com/user-attachments/assets/92d35b5f-1460-44ab-9823-8bf5e0acf5b4" /><br>
<img width="387" height="90" alt="image" src="https://github.com/user-attachments/assets/1478545d-d1ea-4999-ba6c-10f98ee353ba" /><br>
- 그 이후 gsap.timeline()을 통해 모션을 구현했다<br>
<img width="410" height="248" alt="image" src="https://github.com/user-attachments/assets/71375b94-1a1d-459c-a03d-eff5498ecd2d" /><br>
- 애니메이션 도중 GNB 버튼 이동이나 휠 사용(페이지 넘어가기)를 잠금해뒀다<br>
<img width="299" height="63" alt="image" src="https://github.com/user-attachments/assets/ba209529-ffba-40fd-8660-e0d94436e2c6" /><br>

<h3>페이지 별 마루 이동</h3>

PC) 마우스 휠 스크롤 시 이동
