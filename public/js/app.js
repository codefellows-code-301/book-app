'use strict'

$('.details-form-button').on('click', function(){
  console.log('++++button clicked+++++')
  $(this).next().removeClass('details-form');
});