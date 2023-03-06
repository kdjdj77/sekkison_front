// request 세팅
let Request = function() {  
   this.getParameter = function(name) {  
       var rtnval = '';  
       var nowAddress = unescape(location.href);  
       var parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1,  
               nowAddress.length)).split('&');  
       for (var i = 0; i < parameters.length; i++) {  
           var varName = parameters[i].split('=')[0];  
           if (varName.toUpperCase() == name.toUpperCase()) {  
               rtnval = parameters[i].split('=')[1];  
               break;  
           }  
       }  
       return rtnval;  
   }  
}
var request = new Request(); 
let appointId = request.getParameter("id");
let posX, posY;

(function ($) {
   "use strict";
   //[search]
   load(appointId);

   $("#mapBtn").click(function() {
      let mapBox = document.getElementById("mapBox");
      mapBox.classList.toggle("hide");
      mapBox.classList.toggle("vis");
   });
   function load(aid) {
      $.ajax({
         url:path + `/appoints/${aid}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("데이터 받기 성공");
               console.log(data);
               set(data.data);
               loadMembers(aid, data.data.memo);
            } else console.log(data.msg);
         }
      });
   }
   function loadMembers(aid, master) {
      $.ajax({
         url:`${path}/appoints/members/${aid}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
                  console.log("데이터 받기 성공");
                  console.log(data);
                  setMembers(data.data, master);
            } else console.log(data.msg);
         }
      });
   }
   function set(data) {
      $("#title").html(data.title);
      $("#content").html(data.content);
      $("#posX").html(data.posX);
      $("#posY").html(data.posY);
      posX = data.posX;
      posY = data.posY;
      $("#addressDetail").html(data.addressDetail);
      $("#headCnt").html(data.headCnt);
      $("#maxCnt").html(data.maxCnt);
      $("#dDay").html(data.dDay);
      $('#D-d').html("D-" + Math.floor((new Date(data.dDay) - new Date()) / (1000*60*60*24)));
      $("#isPublic").html(data.isPublic ? "공개" : "비공개");
      $("#isRecruit").html(data.isRecruit ? "모집중" : "모집완료");
   }
   function setMembers(data, master) {
      data.forEach(member => {
         let meter = "...m";
         let row = `
            <div style="width:100%; margin:.6rem;">
               <a style="float:left; text-decoration:none; color:black; font-size:1rem;"
                  href="./otherinfo.html?userId=${member.id}">
                  ${member.name}
                  ${member.memo == "master" ? `<i class="fa fa-star"></i>` : ""}
               </a>
               ${master == localStorage.getItem("sks_name") && member.name != master ? `
                  <button style="float:left; font-size:1.5rem; color:red;"
                     type="button" onclick="deleteMember(${member.id})">
                     <i class="fa fa-times"></i>
                  </button>` : ""}
               <div style="float:right;">(${meter})</div>
            </div><br>
         `;
         $("#members").append(`${row}\n`);
      });
   }
})(jQuery);

// 지도를 표시할 div 
let mapContainer = document.getElementById('map'), mapOption = { 
   center: new kakao.maps.LatLng(posX, posY), // 지도의 중심좌표
   level: 3 // 지도의 확대 레벨
};
// 지도를 생성합니다
let map = new kakao.maps.Map(mapContainer, mapOption);
// 마커가 표시될 위치입니다 
let markerPosition  = new kakao.maps.LatLng(posX, posY); 
// 마커를 생성합니다
let marker = new kakao.maps.Marker({
   position: markerPosition
});
marker.setMap(map);