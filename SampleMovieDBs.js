
//curl -i -X GET "http://127.0.0.1:3000"
//curl -i -X POST  -d titol="Penelope" "http://localhost:3000/"
//curl -i -X POST  -d titol="One Day" "http://localhost:3000/"
//curl -i -X POST  -d titol="Not Easily Broken" "http://localhost:3000/"
var express=require('express');
var redis=require('redis');
var	bodyParser=require('body-parser');
var	mongoose=require('mongoose');


var app=express(); //express ortami olustur
app.use(bodyParser.urlencoded({extended:true})); //gelen requestlerin body kisimlarini parse edebilmek icin
app.use(bodyParser.json()); 

var redisClient=redis.createClient(); //redis ortamini baslat
mongoose.connect('mongodb://127.0.0.1/moviesOdev',function(err,res){ //veri tabanina bagla
	if(err) //baglantida hata varsa
		console.log('Connection to MongoDB Database failed.');
	console.log('Successfully Connected to MongoDB Database Called moviesOdev.');
});

var movieSchema=new mongoose.Schema({ //veri tabanina gore bir schema olustur
    //veri tabanindaki field deger ciftleri, bazi fieldlerin string olmasinin sebebi nesnelerin icinde bosluk olmaz ama stringin icinde bosluk olabilir.
    Film:{type:String},
	Genre:{type:String},
	"Lead Studio":{type:String},
	"Audience score %":{type:Number},
	Profitability:{type:Number},
	"Rotten Tomatoes %":{type:Number},
    "Worldwide Gross":{type:String},
    Year:{type:Number}},
	{collection:'imdb'}
);

var film=mongoose.model('Movie',movieSchema); //yeni bir model(veri tabani modeli) olustur

app.get('/',function(req,res){ //Kullanicidan gelen kok dizini altinda get requestler icin
    var html //text field ve button iceren web sayfasi
    html='<!DOCTYPE html><html><head><style> form {margin: 40px auto;'+
         'width: 80%;min-width: 300px;background-color: aliceblue;}'+
         '.title {width: 100%;font-family: Arial, Helvetica, sans-serif;'+
         'font-size: 40px;line-height: 40px;letter-spacing: 1px;'+
         'margin: 10px 0;padding: 20px;}'+
         '* {box-sizing: border-box;}</style></head>'+
         '<body><form action="/" method="post">'+
         '<input type="text" name="titol" required placeholder="Bir Film Adı Giriniz" class="title">'+
         '<input type="submit" name="actualitzar" value="Ara" class="submit">'+
         '</form></body></html>'
         
   res.send(html) //kullaniciya geri cevap olarak gonder        
});

app.post('/',function(req,res){ //kullanicidan gelen kok dizininin altında post requestler icin
    var filmAdi=req.body.titol //text field icindeki degeri parse et
	redisClient.exists(filmAdi,function(err,reply){ //rediste olup olmadigini kontrol et
		if(reply==1) //eger bulunduysa
	    {
	   		console.log('The film ('+filmAdi+') exists in the Redis Cache.');
            redisClient.hgetall(filmAdi, function(err, object) { //hash veri tipi olarak kaydedilmis degerleri getir
            var sayfa //o degerleri kullanarak web sitesini olustur
            sayfa='<!DOCTYPE html><html><head><style> form {margin: 40px auto;'+
                'width: 80%;min-width: 300px;background-color: aliceblue;}'+
                '.title {width: 100%;font-family: Arial, Helvetica, sans-serif;'+
                'font-size: 40px;line-height: 40px;letter-spacing: 1px;'+
                'margin: 10px 0;padding: 20px;}'+
                '* {box-sizing: border-box;}</style></head>'+
                '<body><form action="/" method="post">'+
                '<input type="text" name="titol" required placeholder="Bir Film Adı Giriniz" class="title">'+
                '<input type="submit" name="actualitzar" value="Ara" class="submit">'+
                '</form>'+
                '<table border="1" bgcolor="#ffffff" align="center" width="500">'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Film</td>'+
                '<td>'+object.adi+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Genre</td>'+
                '<td>'+object.genre+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Lead Studio</td>'+
                '<td>'+object.leadstudio+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Audience score %</td>'+
                '<td>'+object.audiancescore+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Profitability</td>'+
                '<td>'+object.prof+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Rotten Tomatoes %</td>'+
                '<td>'+object.rt+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Worldwide Gross</td>'+
                '<td>'+object.wwg+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Year</td>'+
                '<td>'+object.year+'</td></tr></table></body></html>'
                res.send(sayfa) //kullaniciya cevap olarak o web siteyi gonder
            });
	    }
	    else //rediste bulunmadiysa
	    {
           console.log('The film ('+filmAdi+') does not exist in the Redis Cache.');
           film.findOne({"Film": new RegExp('^'+filmAdi+'$', "i")},function(err,movie){
            //veri tabaninda ara
            if(err)
                return res.send({status:500,message:err.message});
            if(!movie) //eger veri tabaninda bulunmadiysa
                 return res.send(""+filmAdi+"  Not found in the Database.")    
           var html //veri tabanindan aldigimiz degerleri kullanarak web sitesini olustur
           html='<!DOCTYPE html><html><head><style> form {margin: 40px auto;'+
                'width: 80%;min-width: 300px;background-color: aliceblue;}'+
                '.title {width: 100%;font-family: Arial, Helvetica, sans-serif;'+
                'font-size: 40px;line-height: 40px;letter-spacing: 1px;'+
                'margin: 10px 0;padding: 20px;}'+
                '* {box-sizing: border-box;}</style></head>'+
                '<body><form action="/" method="post">'+
                '<input type="text" name="titol" required placeholder="Bir Film Adı Giriniz" class="title">'+
                '<input type="submit" name="actualitzar" value="Ara" class="submit">'+
                '</form>'+
                '<table border="1" bgcolor="#ffffff" align="center" width="500">'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Film</td>'+
                '<td>'+movie.Film+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Genre</td>'+
                '<td>'+movie.Genre+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Lead Studio</td>'+
                '<td>'+movie["Lead Studio"]+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Audience score %</td>'+
                '<td>'+movie["Audience score %"]+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Profitability</td>'+
                '<td>'+movie.Profitability+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Rotten Tomatoes %</td>'+
                '<td>'+movie["Rotten Tomatoes %"]+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Worldwide Gross</td>'+
                '<td>'+movie["Worldwide Gross"]+'</td></tr>'+
                '<tr height="50">'+
                '<td bgcolor="#ffd39b" width="50%">Year</td>'+
                '<td>'+movie.Year+'</td></tr></table></body></html>'
           //veri tabanindan cektigimiz degerleri rediste hash olarak kaydet
           redisClient.hmset(filmAdi, { //film adi burada key olarak, diger veriler subkey olarak
           //Bu nedenle hgetall yaptigimizda sadece key ile alabiliyoruz
                        'adi': movie.Film,
                        'genre': movie.Genre,
                        'leadstudio': movie["Lead Studio"],
                        'audiancescore': movie["Audience score %"],
                        'prof':movie.Profitability,
                        'rt': movie["Rotten Tomatoes %"],
                        'wwg': movie["Worldwide Gross"],
                        'year': movie.Year
                });
            console.log('A new film ('+filmAdi+') has been inserted into Redis Cache.');
			redisClient.expire(filmAdi,300); //bes dakika sonra veriler cache hafizasindan silinsin

			res.send(html);			

            }); 
        }
	});    

});
app.listen(3000,function(){console.log('App is Running at http://127.0.0.1:3000')});