$(document).ready(function ($) {
  // 페이지마다 애니메이션 실행여부 => 실행안됨
  let pag1animated = false;
  let pag2animated = false;
  let pag3animated = false;
  let pag4animated = false;

  resize();

  $(window).resize(function ($) {
    resize();
  });

  $(".section .page_wrap").on("init", function () {
    resize();
    if (window.location.hash === "#reservation") {
      // 마루 등장 강제 실행
      const firstMaru = $(".page2 .maru");
      pag2animated = true;

      isReadyForWheel = false;
      isMaruWalking = true;
      // 필요 시 애니메이션 타임라인도 강제 실행
      const page2T1 = gsap.timeline({
        onStart: () => {
          isReadyForWheel = false;
          isMaruWalking = true;
        },
        onComplete: () => {
          isReadyForWheel = true;
          isMaruWalking = false;
        },
      });
      page2T1.fromTo(
        ".tit_day",
        0.1,
        {
          top: -10000,
        },
        {
          top: "14.77%",
        }
      );
      page2T1.fromTo(
        ".reward",
        0.1,
        {
          top: -10000,
        },
        {
          top: "25.39%",
          delay: 0.3,
        }
      );
      page2T1.fromTo(
        ".note",
        0.1,
        {
          top: -10000,
        },
        {
          top: "28.28%",
          delay: 0.3,
        }
      );
      page2T1.fromTo(
        ".reward_txt",
        0.1,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          delay: 0.2,
        }
      );
      page2T1.fromTo(
        ".page2 .sns_li",
        0.1,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          delay: 0.3,
        }
      );
      page2T1.call(() => {
        $(".sns_ul li").addClass("shine");
      });
      page2T1.fromTo(
        ".bubble",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          delay: 0.2,
        }
      );
      page2T1.call(() => {
        firstIn(firstMaru);
      });
    }
  });
  //메인슬라이드
  mainSlider = $(".section .page_wrap");

  let initialSlideIndex = 0;
  if (window.location.hash === "#reservation") {
    initialSlideIndex = 1; 
    if (initialSlideIndex === 1) {
      // 페이지 1 요소들 안 보이게 처리
      gsap.set(
        ".page1 .cafe, .page1 .dust, .page1 .dust_left, .page1 .dust_right, .page1 .maru_txt, .page1 .maru",
        {
          opacity: 0,
          display: "none",
        }
      );
    }
  }

  mainSlider.slick({
    initialSlide: initialSlideIndex,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    swipe: false,
    appendDots: $(".fixed_wrap2"),
    lazyLoad: "progressive",
  });

  /*    mainSlider.on('wheel', function(e) {
          e.preventDefault();
          const maru = $(".slick-active .maru");
          if(maru.hasClass('walking')){
              return false;
          }

          if (e.originalEvent.deltaY < 0) {
              mainSlider.slick('slickPrev');
          } else {
              mainSlider.slick('slickNext');
          }
          

      });*/

  
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", function (e) {
    if (!isReadyForWheel || isMaruWalking) return;
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const maru = $(".slick-active .maru");
    if (!isReadyForWheel || maru.hasClass("walking")) return;

    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const totalSlides = mainSlider.slick("getSlick").slideCount;
    const currentIndex = mainSlider.slick("slickCurrentSlide");

    if (absDeltaY > absDeltaX && absDeltaY > 30) {
      if (deltaY > 0) {
        // 위로 스와이프 (다음 슬라이드)
        if (currentIndex >= totalSlides - 1) return;

        if (!maru.hasClass("arrived")) {
          $(".icon_ytb, .icon_talk").hide();
          walkMaru(maru, () => {
            mainSlider.slick("slickNext");
          });
        } else {
          mainSlider.slick("slickNext");
        }
      } else {
        // 아래로 스와이프 (이전 슬라이드)
        mainSlider.slick("slickPrev");
      }
    }

    // 가로 스와이프
    else if (absDeltaX > 30) {
      if (deltaX > 0) {
        // 왼쪽으로 스와이프 → 다음 슬라이드
        if (currentIndex >= totalSlides - 1) return;

        if (!maru.hasClass("arrived")) {
          $(".icon_ytb, .icon_talk").hide();
          walkMaru(maru, () => {
            mainSlider.slick("slickNext");
          });
        } else {
          mainSlider.slick("slickNext");
        }
      } else {
        // 오른쪽으로 스와이프 → 이전 슬라이드
        mainSlider.slick("slickPrev");
      }
    }
  });



  $(".page .maru").click(function (event) {
    event.preventDefault();

    if (!isReadyForWheel) return;

    const maru = $(".slick-active .maru");
    if (maru.hasClass("walking")) {
      return false;
    }

    if (!maru.hasClass("arrived")) {
      walkMaru(maru, () => {
        mainSlider.slick("slickNext");
      });
    } else {
      mainSlider.slick("slickNext");
    }
  });




  // On before slide change
  mainSlider.on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      if (nextSlide === currentSlide) return;

      var pgaeNum = nextSlide + 1;
      var firstMaru = $(".page" + pgaeNum + " .maru");
      var originMaru = $(".page" + pgaeNum).find(".maru");
      resetMaru(firstMaru);

      // page2~4 firstIn 마루 등장

      if (nextSlide === 0) {
        gsap.set(
          ".page1 .cafe, .page1 .maru_txt, .page1 .maru",
          {
            display: "block",
            opacity: 1,
          }
        );
        gsap.set(".page1 .icon_ytb", {
          opacity: 0,
          // display: "none",
        });
        resetMaru(firstMaru);
        firstIn(firstMaru);
        gsap.to(".page1 .icon_ytb", {
          display: "block",
        });
      }
      if (nextSlide == 1) {
        originMaru.css("opacity", 0);
      }
      if (nextSlide == 1 && pag2animated) {
        firstIn(firstMaru);
      }
      if (nextSlide == 2 && pag3animated) {
        firstIn(firstMaru);
      }
      if (nextSlide == 3 && pag4animated) {
        firstIn(firstMaru);
      }

      // --------page 1
      if (nextSlide == 0 && !pag1animated) {
        pag1animated = true; // 실행됨
        $(".icon_ytb").show();
      }

      // --------page 2
      if (nextSlide == 1 && !pag2animated) {
        pag2animated = true; // 실행됨
        $(".icon_talk").show();

        const page2T1 = gsap.timeline();
        page2T1.fromTo(
          ".tit_day",
          0.1,
          {
            top: -10000,
          },
          {
            top: "14.77%",
          }
        );
        page2T1.fromTo(
          ".reward",
          0.1,
          {
            top: -10000,
          },
          {
            top: "25.39%",
            delay: 0.3,
          }
        );
        page2T1.fromTo(
          ".note",
          0.1,
          {
            top: -10000,
          },
          {
            top: "28.28%",
            delay: 0.3,
          }
        );
        page2T1.fromTo(
          ".reward_txt",
          0.1,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            delay: 0.2,
          }
        );
        page2T1.fromTo(
          ".page2 .sns_li",
          0.1,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            delay: 0.3,
          }
        );
        page2T1.call(() => {
          $(".sns_ul li").addClass("shine");
        });
        page2T1.fromTo(
          ".bubble",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            delay: 0.2,
          }
        );
        page2T1.call(() => {
          firstIn(firstMaru);
        });
      }

      // --------page 3
      if (nextSlide == 2 && !pag3animated) {
        pag3animated = true; // 실행됨

        const page3T1 = gsap.timeline();
        page3T1.fromTo(
          ".tit_event",
          0.1,
          {
            top: -10000,
          },
          {
            top: "14.77%",
            delay: 0.2,
          }
        );
        page3T1.fromTo(
          ".tit_event2",
          0.4,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            delay: 0.3,
          }
        );
        page3T1.fromTo(
          ".money1",
          0.1,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            delay: 0.4,
          }
        );
        page3T1.fromTo(
          ".money2",
          0.1,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            delay: 0.4,
          }
        );
        page3T1.fromTo(
          ".money3",
          0.1,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            delay: 0.4,
          }
        );
        page3T1.fromTo(
          ".money_txt",
          0.1,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            delay: 0.3,
          }
        );

        $(".money.active").each(function () {
          $(this).prepend('<div class="stamp"></div>');
        });

        page3T1
          .fromTo(
            ".stamp",
            {
              scale: 3,
              y: -200,
              opacity: 0,
              rotation: -25,
            },
            {
              scale: 0.8,
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power4.out",
              stagger: 0.3,
            }
          )
          .to(
            ".stamp",
            {
              scale: 1,
              duration: 0.4,
              ease: "elastic.out(1, 0.4)",
            },
            "<+0.05"
          )
          .to(
            ".stamp",
            {
              x: "-=10",
              repeat: 7,
              yoyo: true,
              duration: 0.07,
              ease: "rough({ strength: 3, points: 20, template: sine.inOut, randomize: true })",
            },
            "<+0.1"
          );

        $(".money").each(function () {
          $(this).hover(
            function () {
              $(this).css("transform", "scale(1.05)");
            },
            function () {
              $(this).css("transform", "scale(1)");
            }
          );
        });

        page3T1.call(() => {
          firstIn(firstMaru);
        });
      }
      // --------page 4
      if (nextSlide == 3 && !pag4animated) {
        pag4animated = true; // 실행됨
        const page4T1 = gsap.timeline();
        page4T1.call(() => {
          firstIn(firstMaru);
        });
      }
    }
  );

  // On after slide change
  mainSlider.on(
    "afterChange",
    function (event, slick, currentSlide, nextSlide) {

      const $maru = $(".page" + currentSlide).find(".maru");
      if (skipSlideCallback) {
        skipSlideCallback = false;
      }
      updateNav(currentSlide)

      if (window.location.hash === "#reservation") {
        // 다른 슬라이드로 이동한 경우 해시 제거
        if (currentSlide !== 1) {
          history.replaceState(null, null, window.location.pathname);
        }
      }
    }
  );
});

$(function () {
  $(".logo").click(function () {
    $(".section .page_wrap").slick("slickGoTo", 0);
  });
  $(".hamburger").click(function () {
    $(".menu_wrap").bPopup({
      modalClose: false,
    });
  });
  // fullpage- nav
  $(".fp-slidesNav ul li a span").text("");

  // common
  $(".present").click(function () {
    $(".pop.pop3").bPopup({
      // modalClose: false,
    });
  });
  $(".icon_ytb").click(function () {
    let popup = $(".pop.pop2");
    popup.bPopup({
      // modalClose: false,
      onClose: function () {
        let iframe = popup.find("iframe");
        let src = iframe.attr("src");
        iframe.attr("src", "");
        iframe.attr("src", src);
      },
    });
  });
  $(".note").click(function () {
    $(".pop.pop1").bPopup({
      // modalClose: false,
    });
  });


  $(".nav_ul > li a").click(function (e) {
    e.preventDefault();
    let navNum = $(this).data("nav") - 1;
    console.log(navNum);
    $(".section .page_wrap").slick("slickGoTo", navNum);
    $(".menu_wrap").bPopup().close();
    updateNav(navNum);
  });

  // page별 마루 총총

  gsap.registerPlugin(MotionPathPlugin);

  // ------------page1

  // cafe

  const cafeT1 = gsap.timeline();

  cafeT1.fromTo(
    ".cafe_prev",
    {
      opacity: 1,
    },
    {
      opacity: 0,
      delay: 0.8,
      duration: 0.15,
      ease: "power4.out",
    }
  );
  cafeT1.fromTo(
    ".dust",
    {
      opacity: 0,
      scale: 0.9,
    },
    {
      opacity: 1,
      scale: 1.2,
      duration: 0.1,
      ease: "power2.out",
    },
    "<"
  );

  cafeT1.fromTo(
    ".cafe",
    {
      top: '-1000%',
      opacity: 0,
    },
    {
      opacity: 1,
      top: "32%",
      duration: 0.2,
      ease: "power4.out",
    },
    "<+0.12"
  );

  cafeT1.add(
    () => {
      gsap.fromTo(
        ".dust_left",
        {
          opacity: 0,
          // x: 100,
          // top: 418,
          scale: 0.9,
          rotation: 0,
        },
        {
          opacity: 0.9,
          // x: 50,
          scale: 1.3,
          // rotation: 5,
          duration: 0.6,
          ease: "power2.out",
        }
      );
      gsap.fromTo(
        ".dust_right",
        {
          opacity: 0,
          // top: 440,
          // x: 0,
          scale: 0.9,
          rotation: 0,
        },
        {
          opacity: 1,
          // x: 40,
          // rotation: 5,
          scale: 1.2,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
    //  "<+0.1"
  );
  cafeT1.to(
    ".dust",
    {
      opacity: 0,
      scale: 1,
      duration: 0.01,
      ease: "power2.in",
    },
    "<+0.2"
  );
  cafeT1.to(
    ".dust_left",
    {
      // x:-10,
      // scale: 1.3,
      x: -1,
      opacity: 0,
      duration: 0.9,
      // ease: "power2.in",
    },
    "<+0.03"
  );

  cafeT1.to(
    ".dust_right",
    {
      // x: 80,
      // scale: 1.3,
      x: 1,
      opacity: 0,
      duration: 0.9,
      // ease: "power2.in",
    },
    "<"
  );

  cafeT1.fromTo(
    ".maru_txt",
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.2,
      delay: 0.2,
    }
  );

  const page1maru = $(".page1 .maru");
  //  마루 등장
  cafeT1
    .fromTo(
      page1maru,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        delay: 0.5,
      }
    )
    .call(() => {
      page1maru.addClass("walking");
    });
  cafeT1
    .to(page1maru, {
      duration: 1,
      ease: "power1.inOut",
      motionPath: {
        path: [{ x: "164%", y: "-32%" }],
      },
    })
    .call(() => page1maru.removeClass("walking"))
    .fromTo(
      ".icon_ytb",
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
      "<+0.07"
    );

  // ------------page2

  // ------------page3

  // -----------page4 탭 메뉴
  let currenttTab = $(".tab_ul > li a.tab.on").data("tab");

  /*    if (currenttTab === 1) {
          $(".btn_wrap").hide();
      } else {
          $(".btn_wrap").css("display", "flex");
      }*/

  let initbox2 = false; // slick 초기화
  let initbox3 = false;

  $(".tab_wrap .tab_ul > li a").click(function () {
    $(".tab_ul > li a").removeClass("on");
    $(this).addClass("on");

    const tabNum = $(this).data("tab");

    $(".tab_cont_wrap .box").removeClass("on");
    $(".tab_cont_wrap .box" + tabNum).addClass("on");

    if (tabNum === 2) {
      if (!initbox2) {
        const swiper2 = new Swiper(".swiper2 ", {
          // Optional parameters
          loop: false,
          slidesPerView: 1,
          speed: 500,
          mousewheel: false,
          spaceBetween: 0,

          // If we need pagination
          pagination: {
            el: ".swiper2 .swiper-pagination",
            clickable: true,
            dynamicBullets: true,
          },

          // Navigation arrows
          navigation: {
            nextEl: ".btn_wrap2 .btn_next",
            prevEl: ".btn_wrap2 .btn_prev",
          },

          observer: true,
          observeParents: true,
        });
        initbox2 = true;
      } else {
        // $(".box2 .box_cont .slide").slick("refresh");
      }
      //            $(".btn_wrap").css("display", "flex");
    } else {
      //            $(".btn_wrap").hide();
    }

    if (tabNum === 3) {
      if (!initbox3) {
        const swiper3 = new Swiper(".swiper3 ", {
          // Optional parameters
          loop: false,
          slidesPerView: 1,
          speed: 500,
          mousewheel: false,
          spaceBetween: 0,

          // If we need pagination
          pagination: {
            el: ".swiper3 .swiper-pagination",
            clickable: true,
            dynamicBullets: true,
          },

          // Navigation arrows
          navigation: {
            nextEl: ".btn_wrap3 .btn_next",
            prevEl: ".btn_wrap3 .btn_prev",
          },

          on: {
            init: function () {
              if (this.isBeginning) {
                // 첫 번째 슬라이드일 때 실행할 코드
                console.log("첫 번째 슬라이드입니다.");
                //   alert('ff')
              }
            },
          },

          observer: true,
          observeParents: true,
        });
        initbox3 = true;
      } else {
        // $(".box2 .box_cont .slide").slick("refresh");
      }
      //            $(".btn_wrap").css("display", "flex");
    } else {
      //            $(".btn_wrap").hide();
    }
  });

  //구글 태그용
  $(".slick-dots button").on("click", function (e) {
    e.preventDefault();
    if (!isReadyForWheel || isMaruWalking) return false;
    let tab = $(this).text();
    const maru = $(".slick-active .maru");
    if (maru.hasClass("walking") || maru.hasClass("walking2")) {
      return false;
    } else {
      if (tab == 2) {
        clickTag("menu_preregistration");
      } else if (tab == 3) {
        clickTag("menu_event_complete");
      } else if (tab == 4) {
        clickTag("menu_game_introduction");
      }
    }

    const targetIndex = $(this).parent().index();
    const currentIndex = mainSlider.slick("slickCurrentSlide");

    if (targetIndex === currentIndex) {
      return;
    }

    skipSlideCallback = true; // 슬라이드 강제 이동 플래그
    forcedSlideIndex = targetIndex; // 미리 가기 전에 예약

    mainSlider.slick("slickGoTo", targetIndex);
  });
  
});

// 마루 위치

$(".page .maru").each(function () {
  const $maru = $(this);
  const pos = $maru.position(); // offset()도 가능
  $maru.data("startX", pos.left);
  $maru.data("startY", pos.top);
});

// $(".sns_ul > li .app").click(function (e) {
//   e.preventDefault();
//   let href = $(this).attr("href");
//   $(this).attr("href", "");
//   if ($(this).hasClass("disabled-link")) {
//     $(".pop4").bPopup({
//       // modalClose: true,
//       onComplete: function () {
//         $(".app").attr("href", href);
//       },
//     });
//   } else {
//     window.open(href, "_blank");
//   }
// });

// ---------------------------jquery ------------------------
var isReadyForWheel = true;

function firstIn(maru) {
  if (maru.hasClass("walking")) {
    return;
  }
 // 초기화
  maru.removeClass("arrived");
  maru.find(".icon_ytb, .icon_talk").css({
    opacity: 0,
    display: "none",
  });

  maru.addClass("walking");
  const maruNum = maru.data("maru");
  isReadyForWheel = false;

  var t1 = gsap.timeline({
    onComplete: function () {
      maru.removeClass("walking");
      isReadyForWheel = true;
      isMaruWalking = false;
      $(".icon_ytb, .icon_talk").show();
    },
  });

  if (maru.css("opacity") == 0 || !maru.hasClass("arrived")) {
    gsap.set(maru, {
      x: 0,
      y: 0,
      transform: "none",
    });
  }

  t1.to(maru, {
    opacity: 1,
    duration: 0.2,
    ease: "none",
  });

  if (maruNum === 1) {
    //  마루 등장
    t1.call(() => {
      maru.addClass("walking");
    });
    t1.to(maru, {
      duration: 1.5,
      motionPath: {
        path: [{ x: "164%", y: "-32%" }],
      },
    })
      .call(() => maru.removeClass("walking"))
      .fromTo(
        ".icon_ytb",
        {
          opacity: 0,
          display: "none",
        },
        {
          opacity: 1,
          display: "block",
        },
        "<"
      );
  } else if (maruNum === 2) {
    //  마루 등장
    t1.call(() => {
      maru.addClass("walking");
    });
    t1.to(maru, {
      duration: 1.5,
      motionPath: {
        path: [{ x: "145%", y: "-35%" }],
      },
    })
      .call(() => maru.removeClass("walking"))
      .fromTo(
        ".icon_talk",
        {
          opacity: 0,
          display: "none",
        },
        {
          opacity: 1,
          display: "block",
        },
        "<"
      );
  } else if (maruNum === 3) {
    //  마루 등장
    t1.call(() => {
      maru.addClass("walking");
    });
    t1.to(maru, {
      duration: 1.5,
      motionPath: {
        path: [{ x: "137%", y: "-33%" }],
      },
    }).call(() => maru.removeClass("walking"));
  } else if (maruNum === 4) {
    $(".page4 .tab1").trigger("click");
    //  마루 등장;
    t1.call(() => {
      maru.addClass("walking");
    });
    t1.to(maru, {
      duration: 1.5,
      motionPath: {
        path: [{ x: "-40%", y: "157%" }],
      },
    }).call(() => maru.removeClass("walking"));
  }
}

let isMaruWalking = false;
let skipSlideCallback = false;
let forcedSlideIndex = null; // nav 클릭 시 목적지 슬라이드 인덱스 기억

function walkMaru(maru, callback) {
  const maruNum = maru.data("maru");

  maru = $(maru);

  // 이미 걷는 중
  if (
    isMaruWalking ||
    maru.hasClass("walking") ||
    maru.hasClass("arrived") ||
    !isReadyForWheel
  ) {
    return;
  }

  isReadyForWheel = false;
  isMaruWalking = true;


  $(".icon_ytb, .icon_talk").hide();

  requestAnimationFrame(() => {
    setTimeout(() => {
      maru.find(".icon_ytb, .icon_talk").css({
        display: "none",
        opacity: 0,
      });
      maru.addClass("walking2");
    }, 0);
  });

  const t2 = gsap.timeline({
    onStart: function () {
      maru.addClass("walking2");
    },
    onComplete: function () {
      maru.removeClass("walking2").addClass("arrived");
      isReadyForWheel = true;
      isMaruWalking = false;

      // 강제 이동
      if (skipSlideCallback && typeof forcedSlideIndex === "number") {
        mainSlider.slick("slickGoTo", forcedSlideIndex);
      }
    
      if (!skipSlideCallback && typeof callback === "function") callback();

      skipSlideCallback = false; // 플래그 원복
      forcedSlideIndex = null;
    },
  });

  if (maruNum === 1) {
    gsap.set(maru, { x: "164%", y: "-32%" });
    t2.to(maru, {
      duration: 1.3,
      ease: "none",
      motionPath: {
        path: [
          { x: "227%", y: "-42%" },
          { x: "349%", y: "-22%" },
          { x: "432%", y: "-15%" },
        ],
        curviness: 1,
      },
    });
  } else if (maruNum === 2) {
    gsap.set(maru, { x: "145%", y: "-35%" });
    t2.to(maru, {
      duration: 1.3,
      ease: "none",
      motionPath: {
        path: [
          { x: "228%", y: "-26%" },
          { x: "300%", y: "-14%" },
          { x: "343%", y: "-12%" },
        ],
        curviness: 1,
      },
    });
  } else if (maruNum === 3) {
    gsap.set(maru, { x: "137%", y: "-33%" });
    t2.to(maru, {
      duration: 1.5,
      ease: "none",
      motionPath: {
        path: [
          { x: "230%", y: "-29%" },
          { x: "295%", y: "-23%" },
        ],
        curviness: 1,
      },
    });
  }
}
// menu_wrap update
function updateNav(num){
    $('.nav_ul > li a').removeClass('active')
    $('.nav_ul > li').eq(num).find('a').addClass('active')
}


// page_inner resize 
function resize() {
  winWidth = $(window).width();
  winHeight = $(window).height();

  var scalex = winWidth / 720;
  var scaley = winHeight / 1280;
  /*        var sns_w = $('.sns_wrap ').width();
        var sns_h = $('.sns_wrap ').height();*/
  // var gnb_w = 425; //gnb width
  //   var menu_w = $(".btn_menu").width();
  //   var btClose_w = $(".pop_gnb .btn_close").width();
  //console.log('scalx: '+scalex)
  //console.log('scaley: '+scaley)
  var popHeight = $(".pop").outerHeight() * contScale;


  var contScale = Math.min(scalex, scaley);
//   콘텐츠 고정
  gsap.set($(".page_inner"), { transformOrigin: "50% 50%", scale: contScale });
  gsap.set($(".fixed_wrap .logo"), {transformOrigin: "top left", scale: contScale ,width:'auto',});
  gsap.set($(".present"), {width: 220 * contScale,marginRight:-(220 * contScale/2)});
  // gsap.set($(".present"), {left: '50%', width: 220 * contScale});
  gsap.set($(".hamburger"), { width: 51 * contScale, right:'3.3%'});
  gsap.set($(".sns_ul_right"), { width: 64 * contScale});
  gsap.set($(".fixed_wrap2"), { width: 720 * contScale});
  gsap.set($(".slick-dots"), { width: 580 * contScale});
  gsap.set($(".menu_inner"), { width: 400 * contScale});
  gsap.set($(".menu_close"), { width: 51 * contScale, right:"3%" });
  gsap.set($(".pop"), {transformOrigin: "50% 50%",width: 750 * contScale});
  gsap.set($(".btn_close"), { width: 51 * contScale, top:'4%', right:'4%' });


  // gsap.set($(".pop3"), {
  //   transformOrigin: "center",
  //   transformOrigin: "0% 25%",
  //   scale: contScale,
  //   marginTop: -(($(this).height() * contScale) / 2),
  // });

  // gsap.set($(".copyright"), { width: 304 * contScale});


  // gsap.set($(".present"), {transformOrigin: "top center", scale: contScale ,width:'auto'});
  // $('ㅣㅐㅠㅐ').css('width', gnb_w * contScale);
//   gsap.set($(".fixed_wrap"), { transformOrigin: "50% 0", scale: contScale });
//   gsap.set($(".slick-dots"), { transformOrigin: "50% 0", scale: contScale });
//   gsap.set($(".pop"), { transformOrigin: "0 0", scale: contScale });

  /*        $('.sns_wrap ul').css('width', sns_w * contScale);
        $('.sns_wrap ul').css('margin-left', -(sns_w * contScale)/2);
        $('.sns_wrap ul').css('height', sns_h * contScale);*/
  //$('h1').css('width', gnb_w * contScale);
  //$('.pop_gnb .pop_gnb_inner').css('width', gnb_w * contScale);
  //$('.btn_menu img').css('width', menu_w * contScale);
  //$('.pop_gnb .btn_close img').css('width', btClose_w * contScale);
}

/*document.addEventListener(
"wheel",
function (event) {
  event.preventDefault();

  if (!isReadyForWheel) return;

  const maru = $(".slick-active .maru");
  if(maru.hasClass('walking')){
    return false;
  }

  if (event.deltaY > 0) {
    if (!maru.hasClass("arrived")) {
      walkMaru(maru, () => {
        mainSlider.slickNext
      });
    } else {
      mainSlider.slickPrev
    }
  } else {
    mainSlider.slickNext
  }
},
{ passive: false }
);*/


function resetMaru(maru) {
  maru.removeClass("arrived");
  maru.css({
    transform: "none",
    left: maru.data("startX"),
    top: maru.data("startY"),
    // opacity: 0,
  });

  maru.find(".icon_ytb").css({
    opacity: 0,
    display: "none",
    left: "-33.23%", top:"-17.21%",
  });

  maru.find(".icon_talk").css({
    opacity: 0,
    display: "none",
    left: "28.78%", top: "-10.5%",
  });
}
