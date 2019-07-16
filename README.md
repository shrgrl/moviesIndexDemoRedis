# moviesIndexDemo

## MongoDB
MongoDB, basit anlatımı ile açık kaynak kodlu bir NoSQL veritabanı uygulamasıdır. Esnek ve kullanımı kolay olması nedeniyle kısa zamanda popüler olmuş olup, yaygın bir kitle tarafından kullanılmaktadır.<br>
<strong>MongoDB Özellikleri</strong>
*Öncelikli özellik, ölçeklenebilir olmasıdır (scalable).
*Verileri belge olarak saklar. JSON verileri kullanılabilir. Veriler JSON olarak saklandığı için gelen verilerin yapısı değişse dahi kaydetme konusunda herhangi bir sıkıntı yaşamazsınız.
*Verilerin birden fazla kopyasını saklayabilirsiniz. Böylelikle veri kaybının da önüne geçmiş olursunuz.
*Veriler üzerinde index oluşturabilirsiniz. Böylelikle aradığınız tüm verilere hızlı ve kolay bir şekilde ulaşabilirsiniz.

<strong>Windows İçin MongoDB Kurulumu</strong>

*İlk olarak bilgisayarınızın işletim sistemine uygun olan MongoDB programını indirmekle başlayın. Programın indirildiği yolu Windows path sisteminize eklerseniz ilerleyen dönemlerde komutlarınızı çok daha rahat bir şekilde çalıştırabilirsiniz. Programı indirmek için [bu](https://www.mongodb.org/downloads) linki kullanabilirsiniz.
*İndirdiğiniz kurulum dosyasına tıklayın ve sizi yönlendiren adımları izleyerek kurulum işlemlerini tamamlayın. İndirme yolunuz şöyle olacak: C:\Program Files\MongoDB\Server\3.0.1\bin
*Bu yola gittikten sonra sizin için önemli olan iki dosya göreceksiniz: mongo.exe ve mongod.exe
*MongoDB kullanımı için Command Prompt kullanırsanız bundan sonraki adımlarda rahat edersiniz. Önce biraz önce kullandığınız yolu ortam değişkenlerine ekleyin. Bunun için bilgisayar dosyasına sağ tıklayın ve özelliklere gittikten sonra gelişmiş sistem ayarlarına tıklayın. Burada ortam değişkenlerini göreceksiniz.
*Ortam değişkenlerine girdikten sonra önünüze bir pencere açılacak. Bu pencerede ilgili path’i bulun ve en sonuna MongoDB’nin kendi yolunu yapıştırın.
*İşlem tamam ise, bir sonraki adımda veritabanınızın kaydedileceği yeri belirlemeniz gerekiyor. Öncelikle Cmd’yi açın ve şu komutları çalıştırın: md \data, md \data\db. Bu komutları çalıştırarak önce C dizininin altında bir data klasörü oluşturdunuz, ardından bu data klasörünün de altında db klasörü oluşturdunuz.
*Artık veritabanı uygulamanızı çalıştırabilirsiniz. Server için mongon yazın. Karşınızdaki ekranda “on port 27017” şeklinde bir yazı görürseniz, kurulumunuzu başarıyla gerçekleştirdiniz demektir.

## Redis Cache
Redis; no-sql veritabanı olarak, önbellekleme için ve mesaj sunucusu amacıyla kullanılan, in-memory bir veri-yapıları deposudur. Redis’in kendisini veri-yapıları deposu olarak adlandırmasındaki sebep diğer alternatiflerine göre daha fazla veri türünü desteklemesidir.

<strong>Avantajları</strong>
*Senkron çalıştığı için son derece hızlıdır.
*Birçok veri türünü destekler.
*Veriyi hem RAM üzerine hem de ayarlandığınız konfigürasyona göre disk üzerine kaydedebilir.
*Disk üzerine kayıt yaptığı için restart sonrasında aynı verilerle çalışmaya devam eder.
*Son derece aktif bir kullanıcı kitlesine sahiptir.
*Sharding, Cluster, Sentinel, Replication gibi birçok enterprise özelliklere sahiptir.

##Projenin Çalıştırılması

Bu proje github sayfasında yer alan Movies.csv dosyasını kullanan bir web uygulamasıdır ve <strong><i>Node.js/Express/MongoDB/Redis Cache</i></strong> ile yazılmış olup, lokal bilgisayarımızda çalıştırabilmekteyiz.
Öncelikli olarak Movies.csv dosyasını bilgisayarınızdaki MongoDB veri tabanına import etmemiz gerekmektedir.

```javascript
mongoimport --db dataBaseAdi --collection collectionAdi --type csv --headerline --file csvDosyaAdi.csv
```

<br>Kök dizinine yapılan get request’ler kullanıcının veri girişi yapabileceği bir text kutusu ve sorgula butonu içeren bir html sayfasını response olarak geri döndürüyor. Kullanıcının bu text kutucuğunun içerisine yazdığı bir film adını sorgula butonunu tıklayarak web sunucusuna ilettiği bir post request sonrasında ilgili filmin tüm özellikleri bir tablo içerisinde response olarak geriye döndürülüyor.
Post request ile sunucuya ulaşan film adı önce ön bellekte aranıyor ve bulunursa hemen geriye gönderiliyor. Ön bellekte rastlanamayan film bilgisi veri tabanında aranıyor ve bulunursa hem ön belleğe getiriliyor, hem de yine tablo formatında kullanıcıya response olarak iletiliyor. Ön bellekte saklanan veriler için Hash veri yapısından faydalanılıldı.

## Projenin Çalıştırılması
Projeyi çalıştırırken, projenin bulunduğu kök dizininde komut ekranı açılmalı ve ortamı oluşturmak için ilk önce initialize işlemini yapmamız gerekli. Bu işlemin ardından bize çeşitli sorular gelecektir. İstersek bunları cevaplayabiliriz, istersek de enter diyerek atlayabiliriz.

```javascript
npm init
```

Daha sonra projeyi yazarken kullandığımız modüller sırayla install edilmeli.

```javascript
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

Ana sayfamızda bulunan arama ekranına veritabanımızda bulunan bir film adı yazıp <i>Ara</i> butonuna basmamız gerekiyor. İşlemin ardından bize aradığımız film ile ilgili veritabanındaki tüm bilgiler yansıtılıyor. 

![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img3.JPG)

Aradığımız film Redis Cache'de bulunmuyorsa, film Redis Cache'e ekleniyor. Diğer aramalarda Redis Cache'den kullanılıyor.

![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img4.JPG)

Eğer kutucuğu boş bırakırsak bize bir uyarı kutucuğu gösteriliyor.

![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img5.JPG)

Kutucuğa veritabanında bulunmayan bir film adı girdiğimizde ise karşımıza filmin bulunamadığına dair bir yazı çıkıyor.

![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img6.JPG)
![](https://github.com/shrgrl/moviesIndexDemoRedis/blob/master/img7.JPG)

Uygulamanın arayüzleri ve işleyişi bu şekildedir.

