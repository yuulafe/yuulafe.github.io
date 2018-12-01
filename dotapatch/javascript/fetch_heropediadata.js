        $( function () {
            var URL = ( location.protocol == 'https:' ) ? 'https://www.dota2.com/' : 'http://www.dota2.com/';
            URL = URL + 'jsfeed/heropediadata?feeds=herodata,itemdata';
            $.ajax(
                {
                    type:'GET',
                    cache:true,
                    url: URL,
                    dataType:'jsonp',
                    success: function( data )
                    {
                        g_HeroData = data['herodata'];
                        g_ItemData = data['itemdata'];
                        formatHeroAndItemNotes();
                    }
                }
            );
        } );

        var g_HeroData = false;
        var g_ItemData = false;
        function formatHeroAndItemNotes()
        {
            $.each( ['items','heroes'], function( i, type ) {
                var containers = ['#Heroes','#Items'];
                for ( i = 0; i < containers.length; i++ )
                {
                    container = containers[i];
                    var strContents = $(container).html();
                    if ( strContents )
                    {
                        var foundTags = strContents.match( /\[\[[A-Za-z-_:]+\]\]/g );
                        if ( foundTags )
                        {
                            for ( x = 0; x < foundTags.length; x++ )
                            {
                                tag = foundTags[x];
                                tag = tag.substring( 2, tag.length-2 );
                                var strHTMLNameSuffix = '';
                                if ( tag.includes( ':reworked' ) )
                                {
                                    tag = tag.replace( ':reworked', '' );
                                    strHTMLNameSuffix += '<span class="Reworked">' + ( container == '#Items' ? 'Item Reworked' : 'Ability Rework' ) + '</span>';
                                }
                                if ( tag.includes( ':new' ) )
                                {
                                    tag = tag.replace( ':new', '' );
                                    strHTMLNameSuffix += '<span class="New">New Item</span>';
                                }
                                if ( tag.includes( ':captains' ) )
                                {
                                    tag = tag.replace( ':captains', '' );
                                    strHTMLNameSuffix += '<span class="Captains">Added to Captains Mode</span>';
                                }
                                if ( tag.includes( ':scepteradded' ) )
                                {
                                    tag = tag.replace( ':scepteradded', '' );
                                    strHTMLNameSuffix += '<span class="Scepter">Scepter Added</span>';
                                }
                                if ( tag.includes( ':scepterreworked' ) )
                                {
                                    tag = tag.replace( ':scepterreworked', '' );
                                    strHTMLNameSuffix += '<span class="Scepter">Scepter Reworked</span>';
                                }
                                if ( tag.includes( ':buff' ) )
                                {
                                    tag = tag.replace( ':buff', '' );
                                    strHTMLNameSuffix += '<span class="buff">(+) </span>';
                                }
                                if ( tag.includes( ':nerf' ) )
                                {
                                    tag = tag.replace( ':nerf', '' );
                                    strHTMLNameSuffix += '<span class="nerf">(-) </span>';
                                }
                                if ( tag.includes( ':fix' ) )
                                {
                                    tag = tag.replace( ':fix', '' );
                                    strHTMLNameSuffix += '<span class="fix">(*) </span>';
                                }
                                bUnfound = false;
                                if ( g_ItemData[tag] )
                                {
                                    path = 'items/'+tag+'_lg.png';
                                    name = g_ItemData[tag].dname;
                                    hw = 'width="48" height="36"';
                                }
                                else if ( g_HeroData[tag] )
                                {
                                    path = 'heroes/'+tag+'_sb.png';
                                    name = g_HeroData[tag].dname;
                                    hw = '';
                                }
                                else
                                {
                                    bUnfound = true;
                                }
                                if ( !bUnfound )
                                {
                                    var strHTML = '<div class="ChangeNoteImage"><img src="http://cdn.dota2.com/apps/dota2/images/'+path+'" '+hw+' /></div><br style="clear: left;"/>';
                                    strHTML += '<b>' + name + ':&nbsp;' + strHTMLNameSuffix + '</b>';
                                    strContents = strContents.replace( foundTags[x], strHTML );
                                }
                            }
                            $(container).html( strContents );
                        }
                    }
                }
            });

            var eCount = 0;
            $( '.ChangeDetailsExtended' ).each( function() {
                var $extended = $( this );
                $extended.attr( 'id', 'extended'+eCount );
                $extended.before( '<a href="#" class="ChangeDetailsEToggle" id="eToggle'+eCount+'" onclick="$(\'#extended'+eCount+'\').show();$(this).hide();return false;">+ 세부 사항 보기</a>' );
                $extended.html( '<a href="#" id="eToggleHide'+eCount+'" class="ChangeDetailsEToggle HideButton" onclick="$(\'#extended'+eCount+'\').hide();$(\'#eToggle'+eCount+'\').show();return false;">- 세부 사항 감추기</a>' + $extended.html() );
                eCount++;
            } );
            $( '.ChangeDetailsPopup' ).each( function() {
                var $popup = $( this );
                var $popupHoverButton = $( '<a href="#">[?]</a>' );
                $popup.before( $popupHoverButton );
                $popupHoverButton.hover( function() {
                    $popup.css( "display", "block" );
                }, function() {
                    $popup.css( "display", "none" );
                });
                $popupHoverButton.click( function() {
                    // Suppress the click event
                    return false;
                });
            } );
        }