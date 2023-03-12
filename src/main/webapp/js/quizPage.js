
let titleNM, recommend
const pageCnt = setCnt()
const questionCnt = setCnt('q')
const collectCnt = setCnt('c')
const incollectCnt = setCnt('i')

/**
 * 初期表示
 */
 $(function(){
	
 	$.ajax({
		url:'http://localhost:8080/quiz',
		type:'GET',
		data:{ titleCd : getParam('titleCd') },
		datatype:'json',
	}).done(function(data){
		// sucess
		let data_str = JSON.stringify(data)
		let data_json = JSON.parse(data_str)
		console.log(data_json)
		
		let title = data_json["title"]
		let question = data_json["question"]
		let answer = data_json["answer"]
		
		// タイトル名の反映
		title.forEach(function(t){
			$('#title').text(t.title)
			$('#description').text(t.description)
			recommend = t.recommend
		})
		titleNM = $('#title').text()
		
		// クイズページの作成
		for (let i=1; i<question.length+1; i++){
			$('body').append(createQuiz(i,question,answer))
		}
		questionCnt.setQCnt = question.length
		
	}).fail(function(jqXHR, textStatus, errorThrown){
		// error
		console.log(`statusCd: ${jqXHR.status}, msg: ${textStatus} ${errorThrown}`)
	})
	
	/** タイトルページへ遷移 **/
	$('#back').click(function(){
		window.location.href = './';
	});
	
	/** Start **/
	$('#start').click(function(){
		$('#quiz1').show()
		$('#quizTitle').hide()
	});

});
	

/**
 * URLパラメータの取得
 */
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * クイズページの作成
 */
function createQuiz(i,q,ans){
	
	let quizPage = $('<div>').attr({'id':'quiz'+i, 'class':'quiz'})
	let content = $('<div>').attr('class','wrap')
	content.append($('<p>').text(`Q${i}. ${q[i-1].content}`).attr('class','large'))
	
	let answerList = $('<ol>').attr('class','answerList')
	// 回答の追加
	ans.forEach(function(a){
		if (q[i-1].questionCd == a.questionCd){
			if (q[i-1].answerCd == a.answerCd){
				answerList.append(
					$('<li>').text(a.answer)
						.attr({
							'class':'answer middle',
							'onclick':`collect(this,1,${q[i-1].questionCd})`
						})
					)
			}else {
				answerList.append($('<li>').text(a.answer)
					.attr({
						'class':'answer middle',
						'onclick':`collect(this,2,${q[i-1].questionCd})`
					})
				)
			}
		}
	})
	content.append(answerList)
	
	// 答えの追加
	content.append(
		$('<p>').text('正解').attr('id',`collect${q[i-1].questionCd}`).append(
			$('<p>').text(q[i-1].answerCd).css('color','white')
		).css('color','white')
	)
			
	
	// ボタンの追加
	let nextMsg = '次へ'
	if (i == q.length) nextMsg = '結果確認'
	let btn = $('<p class="center">').append(
				$('<button>').text('戻る')
					.attr({
						'class':'botton gray prev',
						'onclick':'prev()'
					}),
				$('<button>').text(nextMsg)
					.attr({
						'class':'botton blue next',
						'onclick':'next()'
					})
				)
	quizPage.append(content)
	quizPage.append(btn).hide()
	
	return quizPage
}

/**
 * 数のセット カプセル化
 */
 function setCnt(mode){
	let page = 1
	let qCnt = 0
	let cCnt = 0
	let iCnt = 0
	
	// 現在ページ
	if (mode == undefined){
		const obj = {
			cntUp:function (){
				return ++page
			},
			cntDown:function (){
				return --page
			},
			get value(){
				return page
			}
		}
		return obj
	}
	// 質問数
	else if (mode == 'q'){
		const obj = {
			set setQCnt(cnt){
				cCnt = cnt
			},
			get value(){
				return cCnt
			}
		}
		return obj
	}
	// 正解数
	else if (mode == 'c'){
		const obj = {
			cntUp:function (){
				return cCnt++
			},
			cntDown:function (){
				return cCnt--
			},
			get value(){
				return cCnt
			}
		}
		return obj
	}
	// 不正解数
	else if (mode == 'i'){
		const obj = {
			cntUp:function (){
				return iCnt++
			},
			cntDown:function (){
				return iCnt--
			},
			get value(){
				return iCnt
			}
		}
		return obj
	}
}
 
/**
 * 次へ
 */
function next(){
	$(`#quiz${pageCnt.value}`).hide()
	if (pageCnt.value == questionCnt.value){
		$('body').append(createResult())
	}else {
		$(`#quiz${pageCnt.cntUp()}`).show()
	}
}

/**
 * 戻る
 */
function prev(){
	$(`#quiz${pageCnt.value}`).hide()
	if (pageCnt.value != 1){
		$(`#quiz${pageCnt.cntDown()}`).show()
	}else {
		$('#quizTitle').show()
	}
}
 
/**
 * 正解の表示
 */
function collect(obj,kbn,i){
	
	$('#collect'+i).attr('class','collectTitle')
	$(`#collect${i} p`).attr('class','collect').css('color','black')
	$(`#quiz${i} .answer`).attr('onclick',null)
	
	if (kbn == 1){
		obj.style.backgroundColor = '#ff6347'
		$(`#collect${i} .collect`).addClass('maru')
		collectCnt.cntUp()
	}else if (kbn == 2){
		obj.style.backgroundColor = '#1e90ff'
		$(`#collect${i} .collect`).addClass('batu')
		incollectCnt.cntUp()
	}
}

/**
 * 結果ページの作成
 */
function createResult(){
	//console.log(`正解：${collectCnt.value}、不正解：${incollectCnt.value}`)
	let resultHTML = $('<div>').attr({'id':'result','class':'quiz center'}).append(
		$('<div>').attr('class','wrap').append(
			$('<p>').text(`${titleNM}（${questionCnt.value}問）`).attr('class','large'),
			$('<p>').text(`正解： ${collectCnt.value}問`).attr('class','large'),
			$('<p>').text(`不正解： ${incollectCnt.value}問`).attr('class','middle'),
			$('<p>').text(`未回答： ${questionCnt.value - (incollectCnt.value + collectCnt.value)}問`).attr('class','middle'),
			$('<form name="rForm" th:action="@{/recommend/'+ getParam('titleCd') +'}" th:object="${title}" method="put">').append(
				$('<p>').text('★').attr({
					'class': 'middle',
					'id': 'recommend',
					'onclick': 'updRecommend()'
				}).append($('<span>').text('いいね！'),$('<span id="recommend_num">').text(recommend))
			),
			$('<input type="hidden" id="rStatus">').val("cntUp")
		)
	)	
	
	// ボタンの追加
	let btn = $('<p class="center">').append(
				$('<button>').text('タイトルページに戻る')
					.attr({
						'class':'botton gray toTitle',
						'onclick':'toTitle()'
					}),
				$('<button>').text('再挑戦！')
					.attr({
						'class':'botton blue retry',
						'onclick':'retry()'
					})
				)
	resultHTML.append(btn)
	
	return resultHTML
}

/** 再挑戦 **/
function retry(){
	window.location.href = ''
}

/** タイトルページに戻る **/
function toTitle(){
	window.location.href = './'
}

/**
 * おすすめ数の更新
 */
function updRecommend(){
	let rNum = Number($('#recommend_num').text())
	
	if($('#rStatus').val() == 'cntUp'){
		$('#recommend').css({'color':'yellow','background-color':'#c0c0c0'})
		$('#recommend span').css('color','white')
		rNum += 1
		$('#rStatus').val('cntDown')
	}else if($('#rStatus').val() == 'cntDown'){
		$('#recommend').css({'color':'#c0c0c0','background-color':'white'})
		$('#recommend span').css('color','#c0c0c0')
		rNum -= 1
		$('#rStatus').val('cntUp') 
	}
	
	
	$.ajax({
		url:'http://localhost:8080/recommend/' + getParam('titleCd'),
		type:'PUT',
		dataType:'json',
		data:{ recommend: rNum }
	}).done(function(data){
		// sucess
		console.log(data)
		$('#recommend_num').text(data)
		
	}).fail(function(jqXHR, textStatus, errorThrown){
		// error
		console.log(`statusCd: ${jqXHR.status}, msg: ${textStatus} ${errorThrown}`)
	})
	
}