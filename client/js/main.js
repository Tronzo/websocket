$(function() {
	var flag=1;
	if(flag==1){
		$('#placeholder').css('display','none');
		$('.talk-with>button.sound').css('display','block');
	}else{
		$('#placeholder').css('display','block');
		$('.talk-with>button.sound').css('display','none');
		/*互动时刻*/
		$('#content').focus(function(event) {
			$('#placeholder').css('display','none');
		});
		$('#placeholder').click(function(event) {
			$('#placeholder').css('display','none');
			$('#content').focus();
		});
		$('#content').blur(function(event) {
			if(!$(this).html()){
				$('#placeholder').css('display','block');
			}
		});
		/*禁言后*/
		var num=2;
		if(num==1){
			prohibit();/*禁言*/
		}else if(num==2){
			figure();/*解除禁言*/
		}
	}
	/*文本框输入*/
	$("#content").keyup(function(event) {
		var va=$(this).html();
		if(/^\s*?$/.test(va)){
			$('#mjr_send').fadeOut(400);
		}else{
			$('#mjr_send').fadeIn(400);
		}	
	});
	/*音频按钮*/
	$('.talk-with>button.sound').click(function(event) {
		if($(this).hasClass('click')){
			$(this).removeClass('click');
			$('#content').show();
			$('#speak').hide();
		}else{
			$(this).addClass('click');
			$('#content').hide();
			$('#speak').css('display', 'block');	
		}
	})
	var timeOutEvent=0;
	$('#speak').on({
	    touchstart: function(e){
	    	$('#speak').addClass('pressOn');
	    	$('#speak').html('松开 结束');
	        timeOutEvent = setTimeout("longPress()",5000);
	     	e.preventDefault();
	    },
	    touchmove: function(){
			clearTimeout(timeOutEvent);
	    	timeOutEvent = 0;
	    },
	    touchend: function(){
	    	$('#speak').removeClass('pressOn');
	    	$('#speak').html('按住 说话');
	   		clearTimeout(timeOutEvent);
	        if(timeOutEvent!=0){
	            alert("你这是点击，不是长按");
	        }
	        return false;
	    }
	})
});
function prohibit(){
	$('#content,#emoji,.add').addClass('jinyan');
	$('#content').removeAttr('contenteditable');
	$('#emoji,.add').attr('disabled', 'disabled');
	$('#placeholder').css('color','#ABABAB');
	$('#placeholder').html('分享时刻 专心听讲');
	$('#placeholder').unbind('click');
}
function figure(){
	$('#content,#emoji,.add').removeClass('jinyan');
	$('#content').attr('contenteditable','true');
	$('#emoji,.add').removeAttr('disabled');
	$('#placeholder').css('color','#2896E6');
	$('#placeholder').html('互动时刻 点此发言');
	$('#placeholder').click(function(event) {
		$('#placeholder').css('display','none');
		$('#content').focus();
	});
}
