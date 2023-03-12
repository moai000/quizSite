 /**
 * 
 */

 $(function(){
	
	$.ajax({
		url:'http://localhost:8080/title',
		type:'GET',
		datatype:'json',
	}).done(function(data){
		// sucess
		let data_str = JSON.stringify(data)
		let data_json = JSON.parse(data_str)
		console.log(data_json)
		
		data_json.forEach(function(data){
			console.log(`titleCd: ${data['titleCd']}, title: ${data['title']}`)
			$('#quizList').append(
				$('<li>').attr({class:'quizList'}).append(
					$('<div>')
						.text(data['title'])
						.attr({class:'quizContent', 'onclick':`goQuizPage(${data['titleCd']})`}).append(
							$('<p class="quizDescription small">').text(data['description'])
						)
				)
			)
		})
		
	}).fail(function(jqXHR, textStatus, errorThrown){
		// error
		console.log(`statusCd: ${jqXHR.status}, msg: ${textStatus} ${errorThrown}`)
	})
	
})

function goQuizPage(titleCd){
	window.location.href = './quiz.html?titleCd=' + titleCd;
}

/*function IncludeTemplateHTML(filepath){
    $(function (){
        $.ajaxSetup({cache:false});
        $(selector).load(filepath);
    });
}*/
