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

$('.show-bookshelf-list').on('change', function(){
  var selectedBookshelf = $(this).val();
  console.log((this).value)//this works
  if(selectedBookshelf === 'NEW BOOKSHELF'){
    $(this).parent().find('#bookshelf-value').val('');
    $(this).parent().find('#bookshelf-value').show();
    console.log('++++ option changed +++++');
  }else {
    $(this).parent().find('#bookshelf-value').val(selectedBookshelf);
    $('#bookshelf-value').hide();
    console.log('I should be hiding');

  }
});
