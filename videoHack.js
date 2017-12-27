/*
 * hack to get videos
 *
 * @author		Tyler J barnes
 * @contact		b4rn3scode@gmail.com
 * @version		1.0
 */


/*
 * main object
 *
 * @return void
 */
var vHack = function() {

	this.vendorDomain = 'seriesfree.to';
	this.vendorCommonName = 'watchseries';
	this.vendorSeriesListPath = 'serie';
	this.vendorEpisodeListPath = 'episode';
	this.vendorOpenPath = 'cale.html';


	this.targets = {
		theVideo: {
			domain: 'thevideo',
			name: 'thevideo',
			func: 'initthevideo',
		},
		vidziTv: {
			domain: 'vidzi',
			name: 'vidzi',
			func: 'initvidzi',
		},
	};


	this.vendorEpisodeLinks = [];

	this.vendorEpisodeTable = null;






	this.go = function() {
		this.addConsole();
		this.consoleWrite('Hack User, this stuff is for you', '<small>But nothing right now... working</small>');
		this.offAll();

		var me = this;
		setTimeout(function() { me.start(); }, 2000);
	};


	this.offAll = function() {
		$.each($('*'), function(i,e) {
			$(e).off('click');
			$(e).off('mousedown');
			$(e).off('mouseup');
			$(e).off();
			$(e).unbind();
		});
	};




	this.start = function() {
		var host = window.top.location.host;
		var pth = window.top.location.pathname;

		if(host == this.vendorDomain || !!host.match(new RegExp(this.vendorCommonName, "i"))) {
			var pieces = pth.split('/');
			if(pieces.length < 1) {
				this.consoleWrite('Hack User, you need to find your series', '<span>Try searching for it at the top</span>');
			} else {
				var inPieces = false;
				for(var i = 0; i < pieces.length; i++) {
					if(pieces[i] == this.vendorSeriesListPath) {
						this.consoleWrite('Hack User, select the episode you want to watch', '');
						inPieces = true;
						break;
					} else if(pieces[i] == this.vendorEpisodeListPath) {
						this.initEpisodeTargetList();
						inPieces = true;
						break;
					}  else if(pieces[i] == this.vendorOpenPath) {
						this.initEpisodePageButtonClick();
						inPieces = true;
						break;
					}
				}
				if(!inPieces) {
					this.consoleWrite('Hack User, I cant figure out where you are...', '<span>try starting over at the series list</span>');
				}
			}
		} else {
			this.initTargetPageClick(host);
		}
	};



	this.initTargetPageClick = function(host) {
		var inTargets = false;
		for(var t in this.targets) {
			if(!(host.match(new RegExp(this.targets[t].domain, 'i')) === null)) {
				this[this.targets[t].func]();
				inTargets = true;
				break;
			}
		}

		if(!inTargets) {
			this.consoleWrite('Hack User, it doesnt look like youre in the right spot', '<span>try starting over at the series list</span>');
		}
	};



	this.initvidzi = function() {
		/*
		 * THIS IS OLD CODE... HACK USED TO WORK LOOKING THROUGH SCRIPT TAGS...
		 * MAY HAVE TO REVERT SOMEDAY SO KEEPING IT HERE!!!!!
		 * 
		var scriptLst = $('script');
		var inScripts = false;
		for(var i = 0; i < scriptLst.length; i++) {
			var matched = $(scriptLst[i]).text().match(/eval\(/gi);
			if(matched != null && typeof matched.length != 'undefined' && matched.length > 0) {
				inScripts = true;
				var output = eval($(scriptLst[i]).text());
				var file = output.config.playlist[0].sources[1].file;
				this.consoleWrite('Hack User, I found the file', '<span>Redirecting....</span><script>setTimeout(function(){window.location="'+file+'";},1000);</script>');
				break;
			}
		}

		if(!inScripts) {
			this.consoleWrite('Hack User, I couldnt find it', '<span>try another link</span>');
		}
		  */
		
		/*  BEGIN NEW CODE */
		/* NOTE, THIS JUST CHECKS FOR jwPlayer shit and looks through config */
		if(typeof jwplayer != 'undefined' && typeof jwplayer('vplayer') != 'undefined') {
			var confg = jwplayer('vplayer').getConfig();
			if(typeof confg.sources != 'undefined' && confg.sources.length > 0) {
				var str = confg.sources[1].file;
				if(!!str) {
					window.location = str;
				}
			} else { this.consoleWrite('Hack User, I couldnt find it', '<span>try another link</span>'); }
		} else { this.consoleWrite('Hack User, I couldnt find it', '<span>try another link or try to watch video here</span>'); }
	}




	this.initthevideo = function() {
		//this.consoleWrite('STILL WORKING ON THIS SITE... will be done shortly', '<span>try another link</span>');
		//return false;
		if($('#veriform').length > 0 || $('form[data-role=stream-verification-form]').length > 0) {
			$('form').submit();
		} else {
			if(typeof _playerconfig != 'undefined' && typeof _playerconfig.playlist != 'undefined' && typeof _playerconfig.playlist[0].sources != 'undefined') {
				var str = _playerconfig.playlist[0].sources[1].file;
				if(!!str) {
					window.location = str;
				}
			} else {
				this.displayError('Couldnt find anything to get. try another link');
			}
		}
	};




	this.initEpisodePageButtonClick = function() {
		var loc = $('.push_button').attr('href');
		if(!!loc) {
			window.location = loc;
		}
		else { this.displayError('Cannot find button... if you see it, click it "Click Here To Play"'); }
	};




	this.initEpisodeTargetList = function() {
		if(this.getVendorEpisodeTable()) {
			console.log('got episode table', this.vendorEpisodeTable);
			if(this.getVendorEpisodeLinks()) {

				var html = '<ul>';
				for(var i = 0; i < this.vendorEpisodeLinks.length; i++) {
					var num = i+1;
					html += '<li><a href="'+this.vendorEpisodeLinks[i]+'" target="_blank">Link #'+num.toString()+'</a></li>';
				}
				html += '</ul>';

				this.consoleWrite('Hack User, try these links 1 at a time:', html, true);

			}
		}
	};




	this.getVendorEpisodeLinks = function() {
		
		//this.getVendorEpisodeTable();
		var eps = $(this.vendorEpisodeTable).find('tr');
		/*console.log('   EPISODE TR     ');
		console.log(eps);
		console.log('  --    ');*/
		for(var i = 0; i < eps.length; i++) {
			var tmpTarg = $(eps[i]).find('td')[0];
			var targName = $(tmpTarg).text();
			/*console.log('    LINK TARG INFO    ');
			console.log('tmpTarg', tmpTarg, 'targName', targName);
			console.log('   --   ');*/
			for(var t in this.targets) {
				//targName == this.targets[t].name
				if(!!targName.match(new RegExp(this.targets[t].name, 'i'))) {
					var tmpE = $($(eps[i]).find('td')[1]).find('a')[0];
					this.vendorEpisodeLinks.push($(tmpE).attr('href'));
					console.log('    FOUND TARG    ');
					console.log(targName, tmpE);
					console.log('   --   ');
				}
			}
		}

		if(this.vendorEpisodeLinks.length < 1) {
			this.displayError('Found 0 links compatible with this hack right now... ill need to update it');
			return false;
		}

		return true;
	};



	this.getVendorEpisodeTable = function() {
		var tblList = $('table#myTable');
		if(tblList.length < 1) {
			this.displayError('Cannot find episode source list');
		}
		var tmpTbl = tblList[0];
		tmpTbl.id = 'vHackTbl';

		var mainTbl = null;

		var leng = $(tmpTbl).find('tr').length;
		for(var i = 0; i < tblList.length; i++) {
			var elm = tblList[i];
			if(typeof elm.id != 'undefined' && elm.id == tmpTbl.id) {
				continue;
			}
			if($(elm).find('tr').length > leng) {
				mainTbl = elm;
				mainTbl.id = 'vHackMainTbl';
			}
		}

		if(mainTbl != null && mainTbl.id == 'vHackMainTbl' && $(mainTbl).find('tr').length > $(tmpTbl).find('tr').length) {
			this.vendorEpisodeTable = mainTbl;
			return true;
		}
		this.vendorEpisodeTable = tmpTbl;
		return true;

	};



	this.displayError = function(msg) {
		var t = 'Hack user, something fucked up';
		var m = '<span style="color:red">'+msg+'</span>';
		this.consoleWrite(t,m);
	};



	this.consoleWrite = function(msg,content,docWrite) {
		$('#vHackDiv .vHackMsg').text(msg);
		$('#vHackDiv .vHackContent').html(content);
		if(docWrite === true) {
			document.write($('#vHackDiv').html());
		}
	};



	this.addConsole = function() {
		$('body').append('<div id="vHackDiv" style="z-index: 1020;display: block;position: fixed;top: 300px;left: 200px;background: white;padding: 15px;border: 1px red solid;"><span class="vHackMsg" style="font-size:1.1em;color:black;"></span><div class="vHackContent"></div></div>');
	};




}
if('undefined' == typeof jQuery || !jQuery) {
	alert('Hack User:\nYoure not in the right spot...');
} else { window.hack = new vHack(); window.hack.go(); }
