(function () {
	var d = document,
	w = window,
	p = parseInt,
	dd = d.documentElement,
	db = d.body,
	dc = d.compatMode == 'CSS1Compat',
	dx = dc ? dd: db,
	ec = encodeURIComponent;

	w.CHAT = {
		msgObj:d.getElementById("message"),
		screenheight:w.innerHeight ? w.innerHeight : dx.clientHeight,
		username:null,
		userid:null,
		socket:null,
		//让浏览器滚动条保持在最低部
		scrollToBottom:function(){
			//w.scrollTo(0, this.msgObj.clientHeight);
			var bht = $("#message").height();
			$("#doc").scrollTop(bht);
		},
		//退出，本例只是一个简单的刷新
		logout:function(){
			//this.socket.disconnect();
			location.reload();
		},
		//提交聊天消息内容
		submit:function(){
			var content = d.getElementById("content").innerHTML;
			var ins_content = content.replace(/\s+/g,"");
			if(ins_content == "" || ins_content.length == 0){
				$("#content").blur();
				alert("输入信息不能为空，请重新输入！");
				return false;
			}
			else if(ins_content !== ''){
				var obj = {
					userid: this.userid,
					username: this.username,
					content: content
				};
				this.socket.emit('message', obj);
				d.getElementById("content").innerHTML = '';
				if($(".cg_wrapper").css("display") == 'none'){
					$("#content").focus();
				}
			}
			return false;
		},
		genUid:function(){
			return new Date().getTime()+""+Math.floor(Math.random()*899+100);
		},
		//更新系统消息，本例中在用户加入、退出的时候调用
		updateSysMsg:function(o, action){
			//当前在线用户列表
			var onlineUsers = o.onlineUsers;
			//当前在线人数
			var onlineCount = o.onlineCount;
			//新加入用户的信息
			var user = o.user;
				
			//更新在线人数
			var userhtml = '';
			var separator = '';
			for(key in onlineUsers) {
		        if(onlineUsers.hasOwnProperty(key)){
					userhtml += separator+onlineUsers[key];
					separator = '、';
				}
		    }
			d.getElementById("onlinecount").innerHTML = '当前共有 '+onlineCount+' 人在线，在线列表：'+userhtml;
			//var tit = d.getElementsByTagName("title")[0].innerHTML;
			//d.title = tit+"("+onlineCount+")";
			//添加系统消息
			var html = '';
			html += '<div class="msg-system">';
			html += user.username;
			html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
			html += '</div>';
			var section = d.createElement('section');
			section.className = 'system J-mjrlinkWrap J-cutMsg';
			section.innerHTML = html;
			this.msgObj.appendChild(section);
			var bht = $("#message").height();
			$("#doc").scrollTop(bht);
			CHAT.scrollToBottom();
		},
		//禁用用户发言 消息提示
		stoptalk:function(){
			var user_name = $("#cr_username").val();
			var will_name = $(".stoptalk").parents(".service").find(".username").text();

			var html = '';
			html += '<div class="msg-system sttk">';
			html += will_name;
			html += '已被禁言';
			html += '</div>';
			var obj = {
				user_name:user_name,
				will_name:will_name,
				content:html
			}
			this.socket.emit('sysinfo', obj);

		},
		init:function(username){
			/*
			客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
			实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
			*/
			this.userid = this.genUid();
			this.username = username;
			$("#cr_username").val(username);
			d.getElementById("showusername").innerHTML = this.username;
			//this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
			this.scrollToBottom();
			
			//连接websocket后端服务器
			this.socket = io.connect('ws://192.168.31.26:3000');
			
			//告诉服务器端有用户登录
			this.socket.emit('login', {userid:this.userid, username:this.username});
			
			//监听新用户登录
			this.socket.on('login', function(o){
				CHAT.updateSysMsg(o, 'login');	
			});
			
			//监听用户退出
			this.socket.on('logout', function(o){
				CHAT.updateSysMsg(o, 'logout');
			});
			
			//监听消息发送
			this.socket.on('message', function(obj){
				//消息
				var isme = (obj.userid == CHAT.userid) ? true : false;
				var userpic = "<div class='userpic'><img src='./image/user.png' /></div>";
				var contentDiv = '<pre class="dcontent">'+obj.content+'</pre>';
				var usernameDiv = '<p class="username">'+obj.username+'</p>';
				var section = d.createElement('section');

				if(isme){
					section.className = 'user';
					section.innerHTML =userpic + usernameDiv + contentDiv;
				} else {
					section.className = 'service';
					section.innerHTML =userpic + usernameDiv + contentDiv;
				}

				CHAT.msgObj.appendChild(section);
				CHAT.scrollToBottom();
			});

			this.socket.on('sysinfo', function(obj){
				//禁用个体普通用户客户端发言
				console.log(obj);
				if(obj.user_name == obj.will_name){
					alert("您已经被禁言！")
				}
				var section = d.createElement('section');
				section.className = 'system J-mjrlinkWrap J-cutMsg';
				section.innerHTML = obj.content + "";
				CHAT.msgObj.appendChild(section);
				CHAT.scrollToBottom();
			});
		},
		//设置用户名
		//dname:function(){
		//	username = "小明"+(Math.floor(Math.random()*1000 + 1));
		//	d.getElementById("chatbox").style.display = 'block';
		//	this.init(username);
		//}
//---------------------------------------test------------------------------------------
		//第一个界面用户提交用户名
		usernameSubmit:function() {
			var username = d.getElementById("username").value;
			if (username != "") {
				d.getElementById("username").value = '';
				d.getElementById("loginbox").style.display = 'none';
				d.getElementById("chatbox").style.display = 'block';
				this.init(username);
			}
		}
	};
	//通过“回车”提交用户名
	d.getElementById("username").onkeydown = function(e) {
		e = e || event;
		if (e.keyCode === 13) {
			CHAT.usernameSubmit();
		}
	};
//--------------------------------------------------------------------------------
	//普通用户禁言
	$(document).delegate(".stoptalk","touchend",function(){
		CHAT.stoptalk();
		$(".blackbar").fadeOut();
		$(".fn_wrap").remove();
	})
	//普通用户解除禁言
	$(document).delegate(".cancel_it","touchend",function(){

	})
	//全体禁言
	$("#gag").on("touchend",function(){

	})
	//全体解除禁言
	$("#gag_cancel").on("touchend",function(){

	})
})();