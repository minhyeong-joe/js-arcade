var modal;

$('.wrapper').on('click', function() {
  renderModal(this.id);
  modal = document.getElementById(this.id+"Modal");
});

function renderModal(id) {
  $("body").css({"overflow": "hidden"});
  $('#'+id+"Modal").addClass("popup");
  $('#'+id+"Modal>.modalContent").addClass('popup');
}

$('.modalClose').on('click', function() {
  closeModal();
});

$(window).on('click', function(e){
  if (e.target == modal) {
    closeModal();
  }
});

function closeModal() {
  $("body").css({"overflow": "auto"});
  $('.modal.popup').removeClass("popup");
  $('.modalContent.popup').removeClass('popup');
};

//footerLink
$('.footerLink').on('click',function(){
  window.open("https://sanheng03.github.io");
})
