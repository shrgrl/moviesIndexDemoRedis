# moviesIndexDemo
Bu projede github sayfasında yer alan Movies.csv dosyasını kullanan bir web uygulamasıdır ve <strong><i>Node.js/Express/MongoDB/Redis Cache</i></strong> ile yazılmış olup, lokal bilgisayarımızda çalıştırabilmekteyiz.
Öncelikli olarak Movies.csv dosyasını bilgisayarınızdaki MongoDB veri tabanına import etmemiz gerekmektedir.

```javascript
mongoimport --db dataBaseAdi --collection collectionAdi --type csv --headerline --file csvDosyaAdi.csv
```

<br>Kök dizinine yapılan get request’ler kullanıcının veri girişi yapabileceği bir text kutusu ve sorgula butonu içeren bir html sayfasını response olarak geri döndürüyor. Kullanıcının bu text kutucuğunun içerisine yazdığı bir film adını sorgula butonunu tıklayarak web sunucusuna ilettiği bir post request sonrasında ilgili filmin tüm özellikleri bir tablo içerisinde response olarak geriye döndürülüyor.
Post request ile sunucuya ulaşan film adı önce ön bellekte aranıyor ve bulunursa hemen geriye gönderiliyor. Ön bellekte rastlanamayan film bilgisi veri tabanında aranıyor ve bulunursa hem ön belleğe getiriliyor, hem de yine tablo formatında kullanıcıya response olarak iletiliyor. Ön bellekte saklanan veriler için Hash veri yapısından faydalanılıldı.

## Projenin Çalıştırılması
Projeyi çalıştırırken, projenin bulunduğu kök dizininde komut ekranı açılmalı. İlk olarak, projeyi yazarken kullandığımız modüller sırayla install edilmeli.

```javascript
npm init
npm install express
npm install redis
npm install body-parser
npm install mongoose
```
Modülleri indirdikten sonra projemizi çalıştırabiliriz.

```javascript
node moviesIndexDemo.js
```
![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img1.JPG)

Komut ekranında gösterilen port adresini web tarayıcımıza yazdıktan sonra karşımıza uygulamamız gelecek.

![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img2.JPG)

Ana sayfamızda bulunan arama ekranına veritabanımızda bulunan bir film adı yazıyoruz. 

![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img3.JPG)

