'use strict'

$('.form-button').on('click', function(){
  console.log('++++button clicked+++++')
  $(this).next().removeClass('details-form');
});

//not currently working - stretch goal - to hide static details when the form appears.
$('.edit-button').on('click', function(){
  console.log('++++button clicked+++++')
  $('section').next().removeClass('details-show').addClass('details-hide');
});

