//监控粘贴(ctrl+v),如果是粘贴过来的东东，则替换多余的html代码，只保留<br>
function pasteHandler(){
	setTimeout(function(){
		var content = document.getElementById("content").innerHTML;
		valiHTML=["br"];
		content=content.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "&nbsp;&nbsp;").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + valiHTML.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + valiHTML.join("|") + "|img|span)[^\\]]*)\\]", "gi"), "<$1>");
		 if(!$.browser.mozilla){
		 	content=content.replace(/\r?\n/gi, "<br>");
		 }
		document.getElementById("content").innerHTML=content;
	},1);

}
 
//锁定编辑器中鼠标光标位置。。
//function _insertimg(str){
//	var selection= window.getSelection ? window.getSelection() : document.selection;
//	var range= selection.createRange ? selection.createRange() : selection.getRangeAt(0);
//	if (!window.getSelection){
//		document.getElementById('content').focus();
//		var selection= window.getSelection ? window.getSelection() : document.selection;
//		var range= selection.createRange ? selection.createRange() :  ion.getRangeAt(0);
//		range.pasteHTML(str);
//		range.collapse(false);
//		range.select();
//	}else{
//		//document.getElementById('content').focus();
//		range.collapse(false);
//		var hasR = range.createContextualFragment(str);
//		var hasR_lastChild = hasR.lastChild;
//		while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
//			var e = hasR_lastChild;
//			hasR_lastChild = hasR_lastChild.previousSibling;
//			hasR.removeChild(e);
//		}
//		range.insertNode(hasR);
//		if (hasR_lastChild) {
//			range.setEndAfter(hasR_lastChild);
//			range.setStartAfter(hasR_lastChild)
//		}
//		selection.removeAllRanges();
//		selection.addRange(range)
//	}
//}
 
//监控按enter键和空格键，如果按了enter键，则取消原事件，用<BR/ >代替。此处还等待修改！！！！！！如果后端能实现各个浏览器回车键产生的P，div, br的输出问题话就无需采用这段JS、
function enterkey(){
	e = event.keyCode;
	if (e==13||e==32) {
		var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
		event.returnValue = false;  // 取消此事件的默认操作
		if(document.selection && document.selection.createRange){
			var myRange = document.selection.createRange();
			myRange.pasteHTML('<br />');
		}else if(window.getSelection){
			var selection = window.getSelection();
			var range = window.getSelection().getRangeAt(0);
			range.deleteContents();
			var newP = document.createElement('br');
			range.insertNode(newP);
		}
	//alert(document.getElementById("content").innerHTML)
	}
}

//--------------------记录光标所在输入框位置 添加表情---------------------
function into_emoji(str,range,selection){
	//alert(window.getSelection().anchorNode);
	//content.setSelectionRange(3,3);
	var content = document.getElementById("content");
	var ht = content.offsetHeight;

	if (!window.getSelection){
		range.pasteHTML(str);
		range.collapse(false);
		range.select();
	}else{
		range.collapse(false);
		var hasR = range.createContextualFragment(str);
		var hasR_lastChild = hasR.lastChild;
		while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
			var e = hasR_lastChild;
			hasR_lastChild = hasR_lastChild.previousSibling;
			hasR.removeChild(e);
		}
		range.insertNode(hasR);
		if (hasR_lastChild) {
			range.setStartAfter(hasR_lastChild)
			range.setEndAfter(hasR_lastChild);
		}
		selection.removeAllRanges();
		selection.addRange(range);
	}
	$("#content").blur();
	content.scrollTop = ht;
}
//--------------------记录光标所在输入框位置 添加表情---------------------
var addemoji = function(){
	var re,selt;
//屏蔽冒泡点击
	$(".sendbtn,.cg_wrapper,.blackbar").on("click",function(e){
		e.stopPropagation();
	})
	$(".sendbtn,.cg_wrapper,.blackbar").on("touchend",function(e){
		e.stopPropagation();
	})
//----------------------显示选择表情层-------------------
	$("#emoji").on("click ",function(e){
		e.stopPropagation();
		$("#content").show();
		$("#content").focus();
		$("#content").blur();
		selt = window.getSelection ? window.getSelection() : document.selection;
		re = selt.createRange ? selt.createRange() : selt.getRangeAt(0);

		if($(".cg_wrapper").css("display") == 'none'){
			$(".cg_wrapper").show();
			$(".emoji_w").show();
			setTimeout(function(){
				$(".emoji_w").removeClass("hide_block")
			},200 );
			$("#emoji").hide();
			$(".sd_button").removeClass("iconfont icon-jianpan").addClass("sound");
			$("#record").hide();
			$(".keybord").show();
		}else{
			$('.add-function').animate({'bottom':-140}, 300,function(){
				$('.add-function').hide();
			});
			$(".add").removeClass('flag');
			$(".emoji_w").show();
			setTimeout(function(){
				$(".emoji_w").removeClass("hide_block")
			},200 );
			$("#emoji").hide();
			$("#record").hide();
			$(".keybord").show();
		}
	});
//-----------------选择表情--------------------
	$(".emojiRegion>ul>li>img").on("click",function(e){
		e.stopPropagation();
		var url = $(this).get(0).src;
		var imgfile  = "<img src='"+url+"'>";
		//	_insertimg(imgfile);
		into_emoji(imgfile,re,selt);
	});
//------------------显示文字输入 隐藏表情选择层-------------------
	$(".keybord").on("click",function(e){
		e.stopPropagation();
		$("#content").focus();
		$("#emoji").show();
		$(".emoji_w").addClass("hide_block").hide();
		$(".cg_wrapper").hide();
		$(".keybord").hide();

		$('.add-function').animate({'bottom':-140}, 300,function(){
			$('.add-function').hide();
			$(".add").removeClass('flag');
		});
	});
//---------------表情模块 删除模拟-----------------
$(".del_emoji").on("click",function(){
	selt = window.getSelection ? window.getSelection() : document.selection;
	re = selt.createRange ? selt.createRange() : selt.getRangeAt(0);
	var chstart = re.startOffset;
	var chend = re.endOffset;
	var txt = $("#content").html();
	//if(chstart !== chend){
	//	$("#content").html(txt.substring(0,chstart)+txt.substring(chstart,txt.length));
	//}else{
	//	if(chend == txt.length){
	//		$("#content").html(txt.substring(0,txt.length - 1));
	//	}else{
	//		$("#content").html(txt.substring(0,chstart)+txt.substring(chend,txt.length));
	//	}
    //
	//}
	console.info(chstart,chend,window.getSelection(),re.selectNode(2));

})
//------------------点击语音输入----------------
	$(".sd_button").on("click",function(e){
		e.stopPropagation();
		if($(this).hasClass("sound")){
			$(this).addClass("iconfont icon-jianpan");
			$("#emoji").show();
			$("#record").css({"display":"block"});
			$(".emoji_w").addClass("hide_block").hide();
			$(".cg_wrapper").hide();
			$(".keybord").hide();
			/*$("#content").hide();*/

			$('.add-function').animate({'bottom':-140}, 300,function(){
				$('.add-function').hide();
			});
			$(".add").removeClass('flag');
		}else{
			$("#content").show();
			$("#record").hide();
			$(this).removeClass("iconfont icon-jianpan").addClass("sound");
			$("#content").focus();
		}
	})
//---------------外层点击 隐藏表情选择层 文字输入层--------------
	$("#chatbox").on("click",function(){
		$(".cg_wrapper").hide();
		$("#emoji").show();
		$(".keybord").hide();
		$('.add-function').animate({'bottom':-140}, 300,function(){
			$('.add-function').hide();
		});
		$(".add").removeClass('flag');
	})
//----------------------------------------------------------------------
//-----------------------------------讲义图显示发送-----------------------------------
	$("#notes").on("click",function(){
		$(".speak_pic").fadeIn(300);
	})

	$(".send-talk-pic button").on("click",function(){
		$(".speak_pic").fadeOut(200);
		$('.add-function').animate({'bottom':-140}, 300,function(){
			$('.add-function').hide();
			$(".add").removeClass('flag');
		});
		$(".cg_wrapper").hide();
	})
//------------------------------------------------------------------------------------
//----------------------------------大纲显示发送--------------------------------------
	$("#outline").on("click",function(){
		$(".outline").fadeIn(300);
	})

	$(".send-talk-pic button").on("click",function(){
		$(".outline").fadeOut(200);
		$('.add-function').animate({'bottom':-140}, 300,function(){
			$('.add-function').hide();
			$(".add").removeClass('flag');
		});
		$(".cg_wrapper").hide();
	})
//------------------------------------------------------------------------------------
//讲义图 选择
	$('.talk-notes-pic>li').click(function(event) {
		var index=$(this).index();
		$(this).addClass('checked').siblings().removeClass('checked');
		$('.send-talk-pic>button>span').html(index+1);
	});
//大纲选择
	$('.outline-content>li>ol>li').click(function(event) {
		$(this).addClass('active').siblings().removeClass('active');
		$(this).parents('li').siblings().find('li').removeClass('active');
	});

//*添加功能模块*/
	/*var addHeight=$('.add-function').outerHeight();*/
	$('.add-function').css('bottom',-140);
	$('.add').click(function(e) {
		e.stopPropagation();
		$(".cg_wrapper").show();
		if($(this).hasClass('flag')){
			$('.add-function').animate({'bottom':-140}, 300,function(){
				$('.add-function').hide();
			});
			$(".cg_wrapper").hide();
			$(this).removeClass('flag');
		}else{
			$(".emoji_w").addClass("hide_block");
			$(".emoji_w").hide();
			$(".cg_wrapper").show();
			$('.add-function').show();
			$('.add-function').animate({'bottom':0}, 300);
			$(this).addClass('flag');

			$("#content").show();
			$("#record").hide();

			$("#emoji").show();
			$(".keybord").hide();
			$(".sd_button").removeClass("iconfont icon-jianpan").addClass("sound");
		}
	});

	var intDiff = parseInt(12);//倒计时总秒数量
	function timer(intDiff){
		window.setInterval(function(){
			var day=0,
				hour=0,
				minute=0,
				second=0;//时间默认值
			if(intDiff > 0){
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			$('#day_show>b').html(day);
			$('#hour_show>b').html(hour);
			$('#minute_show>b').html(minute);
			$('#second_show>b').html(second);
			intDiff--;
			if(day!=0){
				$('#minute_show,#second_show').css('display','none');
				$('#day_show,#hour_show').css('display','inline-block');
			}else if(day==0&&hour!=0){
				$('#day_show,#second_show').css('display','none');
				$('#hour_show,#minute_show').css('display','inline-block');
			}else if(day==0&&hour==0&&minute!=0){
				$('#day_show,#hour_show').css('display','none');
				$('#minute_show,#second_show').css('display','inline-block');
			}else if(day==0&&hour==0&&minute==0&&second!=0){
				$('#day_show,#hour_show,#minute_show').css('display','none');
				$('#second_show').css('display','inline-block');
				if(second<=59){
					$('#second_show>span').css('display','none');
				}
				if(second<=9){

				}
			}else if(day==0&&hour==0&&minute==0&&second==0){
				/*alert(1);*/
			}
		}, 1000);
	}
	/*倒计时*/
	timer(intDiff);

	//-------------------点击用户头像禁言----------------------
	$(document).delegate(".service .userpic","touchend",function(){
		var name = $(this).next().text();
		var img = $(this).find("img").attr("src");
		$(this).css({"z-index":"3"});
		$(".blackbar").fadeIn();
		$(this).parent().append('<div class="fn_wrap"><img src="'+img+'" class="fn_userpic" /><div class="fn_aside"><p>'+name+'将会被禁言</p><div class="fn_btn"><a href="javascript:void(0);" class="stoptalk" >禁言</a><a href="javascript:void(0);" class="cancel_st">取消</a></div></div></div>');

	})

	$(document).delegate(".cancel_st","touchend",function(){
		$(".blackbar").fadeOut();
		$(".fn_wrap").remove();
	})



}




