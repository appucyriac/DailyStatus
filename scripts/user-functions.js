const charCounter=() =>
{
    let max = 180;
    let len = $('#activity-descr').val().length;
    if(len<=max)
    {
      $('#character-counter')[0].innerHTML=max-len;
    }
}