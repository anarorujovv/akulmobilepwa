Bu react natice pwa projesi ama src içerisindekiler react native cli dan gelen kodlar.
Şimdi o kodların hepsi react.js pwa çevrilmelidir.
Ve içerisindeki librarylar react.js pwa için olanlar ile değiştirilmelidir.
UI olarakta ant design mobile kullanılmalıdır ui tarafdan, Çün ki. react native ui, React.js da çalışmıyor.
Burada kod tarafdan aşırı şekilde titiz çalışılmalıdır. Ve dğeişikliklerde yapılırkın o kodun çalışma mantığı hiçbirşekilde değişmemelidir. Sadece olarak react pwada çalışa bilir vazyete gelmelidir.
En esaslardan biride burada iconları değiştirmen gereklidir. Buradaki iconlar react native ait iconlar ama sen react.js ait iconları yüklemen gerekldiir.
Ant design mobile componentlerinide kullanırken test etmen gereklidir. Var olan componentleri kullanman gereklidir.
Gereksiz zaman alan hatalar olmasın dikkatli titiz çalışma olmalıdır.
Aynı zamanda burada Stili bire bir benzetmen gerekli değil ui tarafdan,
Esas olan componentlerin layout aynı olsun yerleri aynı olsun.
Aynı zamanda şimdilik scanner componentini disabled yap ve birde print çün ki, Bunlar daha sonra üzerinde çalışılması gerekli olan konulardır.
Ve burada file ları falan silip tekrardan yazmadan sadece olarak içerisindeki kodlar refactor ederek react.js hazır hale getirmen gereklidir.
Kodlarında js tarafı zaten çalışıyor esas çalışma burada ui ux tarafdan olucak çün kİ, React native ait olan ui codlar hiçbirisi react.js da çalışmıyor ve bunlarda düzeltirken titizlik ile düzeltilmelidir.
Ve burada uygulama girildiği zaman yükleye bilmesi için modalda çıkmalıdır karşısına.
Ve en esası dikkat etmen gerekli olan yerlerden bir diğeride burada layout stil hatalarının olmamasıdır.
Gereksiz scrollar falan oluşmamalıdır.
Uygulamda kodların çalışma mantığı değişmemelidir bu emirdir.
Yani algoritmalarda falan kod düzenlenmesi kodların düzeltimesi gibi eylemler yapmaman gereklidir. Bu bir şartdır!.
Ve eski react native projesinde içerisinde kullanılan libraryları @package.md file içerisine ekledim oradan bakarak neler kullanıldığını daha net ve daha hızlı şekilde öğrene bilirsin.

Bunun için uzun ve detaylı bir plan hazırlaman gereklidir.
İlk öncede sistemi iyice analiz etmen gereklidir ki, Detaylı ve aynı zamanda uzun plkan ve güzel başarıı plan kura bilesin diye.
En esas olarakta burada package.json içerisindeki sürümleri denetle ve bir birine uyumsuzluk olmasın versionlarda.