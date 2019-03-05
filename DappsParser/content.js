window.onload=function(){
    
	var updates = false;
	
	var pathname = window.location.pathname; // Returns path only (/path/example.html)
	var url      = window.location.href;     // Returns full URL (https://example.com/path/example.html)
	var origin   = window.location.origin;   // Returns base URL (https://example.com)
	
	if( url.toLowerCase().indexOf('https://www.dappradar.com/rankings/protocol/eos') >= 0 ){
		//On home Page
		setTimeout(()=>{
			var total = 0;
			$( ".column-flex > a" ).each(function( index ) {
				var dapp = $( this ).attr('href');
				if( total >= 5 ){ return; }
				if( dapp.toLowerCase().indexOf('/rankings/protocol/eos') == -1 ){
					//window.open('https://www.dappradar.com'+dapp+'?act=load', '_blank', 'width=200 height=200');
					total++;
				}
			});
		},700);
	}else{
		if( window.location.href.toLowerCase().indexOf('?act=load') >= 0 ){
			setTimeout(()=>{
				try{
					var dapp = {};
					dapp.name = $( '.dapp-title-text' ).html();
					var description = $( '.dapp-description-text' ).html();
					dapp.description = description.replace('<p></p>','').replace('<p></p>','');
					dapp.address = $( '.contract-address > a' ).html();
					
					
					dapp.telegram = $( '[data-original-title="telegram"] > a' ).attr('href');
					dapp.twitter = $( '[data-original-title="twitter"] > a' ).attr('href');
					dapp.medium = $( '[data-original-title="medium"] > a' ).attr('href');
					dapp.facebook = $( '[data-original-title="facebook"] > a' ).attr('href');
					dapp.github = $( '[data-original-title="GitHub"] > a' ).attr('href');
					dapp.weibo = $( '[data-original-title="Weibo"] > a' ).attr('href');
					
					console.log( dapp );
					//alert( JSON.stringify(dapp) );
					add_dapp( dapp );
				}catch(e){
					alert('ERROR IMPORT DAPP');
				}
			},700);
		}
	}
	function add_dapp( dapp ){
		$.post('http://localhost/apps', { 'action':'add_dapp', 'dapp': JSON.stringify( dapp ) },
		function(response) {
			console.log('RESULT', response);
			if( window.location.href.toLowerCase().indexOf('?act=load') >= 0 ){
				window.close();
			}
		});
	}
}