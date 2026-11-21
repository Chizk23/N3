import { VocabItem, GrammarItem } from '../types';

export const SAMPLE_VOCAB: VocabItem[] = [
  {
    id: "A911-1",
    deck: "A911",
    stt: 1,
    word: "栄養",
    reading: "えいよう",
    meaning: "Dinh dưỡng",
    pos: "noun",
    exampleJa: "バランスの良い食事で栄養をとりましょう。",
    exampleVi: "Hãy ăn uống cân bằng để bổ sung dinh dưỡng.",
    freq: 6
  },
  {
    id: "A911-2",
    deck: "A911",
    stt: 2,
    word: "優勝",
    reading: "ゆうしょう",
    meaning: "Chiến thắng, vô địch",
    pos: "noun",
    exampleJa: "チームが優勝しました。",
    exampleVi: "Đội đã giành chức vô địch.",
    freq: 5
  },
  {
    id: "A911-5",
    deck: "A911",
    stt: 5,
    word: "発展",
    reading: "はってん",
    meaning: "Phát triển",
    pos: "noun",
    exampleJa: "科学技術が急速に発展しています。",
    exampleVi: "Khoa học công nghệ đang phát triển nhanh chóng.",
    freq: 4,
    highlighted: true
  },
  {
    id: "A911-6",
    deck: "A911",
    stt: 6,
    word: "渋滞",
    reading: "じゅうたい",
    meaning: "Sự tắc nghẽn giao thông",
    pos: "noun",
    exampleJa: "朝の渋滞で遅れてしまいました。",
    exampleVi: "Tôi đã bị trễ vì kẹt xe buổi sáng.",
    freq: 4
  },
  {
    id: "A911-70",
    deck: "A911",
    stt: 70,
    word: "電子レンジ",
    reading: "でんしれんじ",
    meaning: "Lò vi sóng",
    pos: "noun",
    exampleJa: "電子レンジでご飯を温めました。",
    exampleVi: "Tôi đã hâm nóng cơm bằng lò vi sóng.",
    freq: 2,
    highlighted: true
  },
  {
    id: "A911-71",
    deck: "A911",
    stt: 71,
    word: "興味",
    reading: "きょうみ",
    meaning: "Hứng thú",
    pos: "noun",
    exampleJa: "日本の文化に興味があります。",
    exampleVi: "Tôi có hứng thú với văn hóa Nhật Bản.",
    freq: 2
  },
  {
    id: "A911-78",
    deck: "A911",
    stt: 78,
    word: "故障",
    reading: "こしょう",
    meaning: "Sự hỏng; hỏng hóc",
    pos: "noun",
    exampleJa: "エアコンが故障して動かない。",
    exampleVi: "Máy điều hòa bị hỏng và không hoạt động.",
    freq: 2,
    highlighted: true
  },
  {
    id: "B349-2",
    deck: "B349",
    stt: 2,
    word: "腰",
    reading: "こし",
    meaning: "Eo lưng; hông",
    pos: "noun",
    exampleJa: "長時間座っていて腰が痛くなった。",
    exampleVi: "Vì ngồi lâu nên tôi bị đau lưng.",
    freq: 4
  }
];

export const SAMPLE_GRAMMAR: GrammarItem[] = [
  {
    "id": "GRAMMAR-0001",
    "stt": 1,
    "category": "N3",
    "pattern": "～において",
    "meaning": "Ở / trong / tại",
    "exampleJa": "会議は東京において行われます。",
    "exampleVi": "Cuộc họp được tổ chức tại Tokyo.",
    "freq": 7,
    "context": "Văn viết, thông báo, sự kiện trang trọng. Nêu nơi chốn / lĩnh vực / hoàn cảnh diễn ra sự việc.",
    "formation": "N + において (bổ nghĩa danh từ: N における N)",
    "confusables": [
      "～で (dùng thường ngày)",
      "～に対して",
      "～について"
    ]
  },
  {
    "id": "GRAMMAR-0002",
    "stt": 2,
    "category": "N3",
    "pattern": "～たびに",
    "meaning": "Cứ mỗi khi.../Mỗi lần...lại...",
    "exampleJa": "健康診断を受けるたびに、医者から運動不足だと注意される。",
    "exampleVi": "Mỗi lần đi khám sức khỏe, tôi đều bị bác sĩ nhắc nhở là thiếu vận động.",
    "freq": 6,
    "context": "Sự việc lặp lại mỗi lần gặp một tình huống; vế sau thường là kết quả / cảm xúc cố định.",
    "formation": "Vる / N の + たびに",
    "confusables": [
      "～ごとに (chu kỳ đều đặn)",
      "～と (hễ... thì)",
      "～とき"
    ]
  },
  {
    "id": "GRAMMAR-0003",
    "stt": 3,
    "category": "N3",
    "pattern": "～んじゃない（か）／～のではないだろうか／～のではないでしょうか",
    "meaning": "Chẳng phải là...? Tôi nghĩ là...",
    "exampleJa": "あの人、Quyen先生なんじゃないか？",
    "exampleVi": "Người kia chẳng phải là cô Quyên sao?",
    "freq": 6,
    "context": "Hội thoại: suy đoán nhẹ hoặc xác nhận lại. Dạng ～のではないでしょうか lịch sự hơn, dùng trong văn nói trang trọng / văn viết.",
    "formation": "Thể thường (Naな, N な) + んじゃない(か) / のではないだろうか / のではないでしょうか",
    "confusables": [
      "～かもしれない (suy đoán yếu hơn)",
      "～のではない (phủ định thuần túy)",
      "～んじゃない？ (khi lên giọng là câu hỏi / gợi ý)"
    ]
  },
  {
    "id": "GRAMMAR-0004",
    "stt": 4,
    "category": "N3",
    "pattern": "～がる・がっている",
    "meaning": "1. Mong muốn...(ai đó muốn) 2. Cảm thấy...",
    "exampleJa": "子供がおもちゃを欲しがって泣いている。",
    "exampleVi": "Đứa trẻ đang khóc vì muốn có đồ chơi.",
    "freq": 6,
    "context": "Mô tả cảm xúc / mong muốn của NGƯỜI THỨ BA dựa trên biểu hiện bên ngoài (không dùng cho ngôi 1).",
    "formation": "Aい bỏ い + がる; Aな bỏ な + がる; Vたい → Vたがる",
    "confusables": [
      "～たい / ～ほしい (ngôi 1)",
      "～てほしい",
      "～そう"
    ]
  },
  {
    "id": "GRAMMAR-0005",
    "stt": 5,
    "category": "N3",
    "pattern": "～てくる",
    "meaning": "1. Di chuyển về phía người nói 2. Bắt đầu từ quá khứ, kéo dài đến hiện tại 3. Thứ chưa từng thấy bỗng xuất hiện",
    "exampleJa": "木からりんごが落ちてきた。",
    "exampleVi": "Quả táo rơi xuống từ trên cây.",
    "freq": 6,
    "context": "Chuyển động tiến lại gần người nói; thay đổi dần cho đến hiện tại; hiện tượng bất ngờ xuất hiện (mưa, mùi, cảm xúc...).",
    "formation": "Vて + くる (くる chia: きた, きて, こない...)",
    "confusables": [
      "～ていく (đi xa người nói / hướng về tương lai)",
      "～ようになる",
      "～はじめる"
    ]
  },
  {
    "id": "GRAMMAR-0006",
    "stt": 6,
    "category": "N3",
    "pattern": "～うちに",
    "meaning": "1. Trong khi / trong lúc còn... 2. Trong khi đang... thì",
    "exampleJa": "朝のうちに宿題をしてしまったほうがいいよ。",
    "exampleVi": "Tốt hơn là nên làm xong bài tập trong buổi sáng.",
    "freq": 6,
    "context": "(1) Tranh thủ làm khi trạng thái chưa thay đổi; (2) đang làm gì đó thì tình huống thay đổi lúc nào không hay.",
    "formation": "Vる / Vている / Vない / Aい / Aなな / N の + うちに",
    "confusables": [
      "～間に (khoảng thời gian trạng thái liên tục)",
      "～間 (suốt khoảng thời gian)",
      "～前に"
    ]
  },
  {
    "id": "GRAMMAR-0007",
    "stt": 7,
    "category": "N3",
    "pattern": "～に違いない",
    "meaning": "Chắc chắn là / nhất định là",
    "exampleJa": "あの人は日本人に違いない。",
    "exampleVi": "Người kia chắc chắn là người Nhật.",
    "freq": 6,
    "context": "Phán đoán rất chắc dựa trên căn cứ của người nói; không dùng cho ý chí hay hành động của chính mình.",
    "formation": "Thể thường + に違いない (Na và N bỏ だ)",
    "confusables": [
      "～はずだ (căn cứ logic)",
      "～かもしれない (khả năng thấp)",
      "～だろう"
    ]
  },
  {
    "id": "GRAMMAR-0008",
    "stt": 8,
    "category": "N3",
    "pattern": "～って",
    "meaning": "1.(Ai đó) nói rằng.../Nghe nói là... 2. Gọi là...",
    "exampleJa": "ティックトックってアプリ、知ってる？",
    "exampleVi": "Bạn có biết ứng dụng tên là \"TikTok\" không?",
    "freq": 5,
    "context": "Hội thoại thân mật: trích dẫn lời nói, nghe nói, giới thiệu tên gọi / chủ đề.",
    "formation": "N / thể thường + って (= と / という / ということ)",
    "confusables": [
      "～という (văn viết)",
      "～と (trích dẫn)",
      "～ってば (nhấn mạnh)"
    ]
  },
  {
    "id": "GRAMMAR-0009",
    "stt": 9,
    "category": "N3",
    "pattern": "～ようと思っている／と思う",
    "meaning": "Dự định, định làm gì",
    "exampleJa": "明日映画を見ようと思っている。",
    "exampleVi": "Tôi định đi xem phim ngày mai.",
    "freq": 5,
    "context": "Nói ý định chủ quan của bản thân (chưa chốt hoàn toàn).",
    "formation": "Vよう (thể ý chí) + と思う / と思っている",
    "confusables": [
      "～つもり (kế hoạch chắc hơn)",
      "～ことにする (quyết định)",
      "～予定だ (lịch trình)"
    ]
  },
  {
    "id": "GRAMMAR-0010",
    "stt": 10,
    "category": "N3",
    "pattern": "～によって・により",
    "meaning": "1. Vì../Do... 2. Bằng.../Thông qua... 3. Tùy theo / Phụ thuộc vào...",
    "exampleJa": "彼女は気分によって態度が変わるので、困る。",
    "exampleVi": "Cô ấy thay đổi thái độ tùy theo tâm trạng, nên thật là khó xử.",
    "freq": 5,
    "context": "Văn viết: nguyên nhân, phương tiện, tác nhân trong câu bị động, hoặc \"tùy từng trường hợp\".",
    "formation": "N + によって / により; N によって + V bị động; N によって + 違う / 変わる",
    "confusables": [
      "～によると (nguồn tin)",
      "～による N",
      "～によっては (có trường hợp)",
      "～で"
    ]
  },
  {
    "id": "GRAMMAR-0011",
    "stt": 11,
    "category": "N3",
    "pattern": "～にとって",
    "meaning": "Đối với...",
    "exampleJa": "ベトナム人の消費者にとって、Shopeeは一番便利なアプリです。",
    "exampleVi": "Đối với người tiêu dùng Việt Nam, Shopee là ứng dụng tiện lợi nhất.",
    "freq": 5,
    "context": "Đánh giá / nhận định từ lập trường của một người hay nhóm; vế sau là tính từ / câu đánh giá.",
    "formation": "N + にとって (N にとっての N)",
    "confusables": [
      "～に対して (đối tượng của hành động)",
      "～として (tư cách)",
      "～からすると"
    ]
  },
  {
    "id": "GRAMMAR-0012",
    "stt": 12,
    "category": "N3",
    "pattern": "～てほしい",
    "meaning": "Muốn ai làm...",
    "exampleJa": "家族にはずっと元気でいてほしいです。",
    "exampleVi": "Tôi mong gia đình mình luôn luôn mạnh khỏe.",
    "freq": 5,
    "context": "Mong muốn người khác làm / giữ trạng thái nào đó; chủ ngữ là ngôi thứ nhất.",
    "formation": "Vて + ほしい; phủ định: Vないで + ほしい",
    "confusables": [
      "～たい (tự mình muốn làm)",
      "～てもらいたい (lịch sự hơn)",
      "～がる"
    ]
  },
  {
    "id": "GRAMMAR-0013",
    "stt": 13,
    "category": "N3",
    "pattern": "～ようとする",
    "meaning": "Định làm.../Cố gắng làm...",
    "exampleJa": "この猫は、私が触ろうとすると、すぐ逃げる。",
    "exampleVi": "Con mèo này, hễ tôi định chạm vào thì nó lập tức bỏ chạy.",
    "freq": 5,
    "context": "Hành động đang / sắp bắt đầu nhưng thường bị gián đoạn; hoặc nỗ lực làm gì.",
    "formation": "Vよう (thể ý chí) + とする",
    "confusables": [
      "～ようと思う (dự định)",
      "～てみる (thử)",
      "～ようとしない (không chịu)",
      "～ようにする"
    ]
  },
  {
    "id": "GRAMMAR-0014",
    "stt": 14,
    "category": "N3",
    "pattern": "～そうもない・そうにない",
    "meaning": "Không có vẻ gì là.../Khó mà...",
    "exampleJa": "筋肉痛で今日は歩けそうにない。",
    "exampleVi": "Vì bị đau cơ nên hôm nay có lẽ tôi không thể đi được.",
    "freq": 4,
    "context": "Phán đoán khả năng thấp dựa trên tình hình hiện tại.",
    "formation": "Vます bỏ ます + そうもない / そうにない",
    "confusables": [
      "～そうだ (có vẻ)",
      "～なさそうだ (với tính từ phủ định)",
      "～ないそうだ (nghe nói là không)"
    ]
  },
  {
    "id": "GRAMMAR-0015",
    "stt": 15,
    "category": "N3",
    "pattern": "～に・と比べて",
    "meaning": "So với...",
    "exampleJa": "田舎は都会に比べて、交通が不便ですが、静かで暮らしやすいです。",
    "exampleVi": "So với thành phố, vùng nông thôn giao thông không thuận tiện, nhưng yên tĩnh và dễ sống.",
    "freq": 4,
    "context": "So sánh hai đối tượng, vế sau nêu đặc điểm.",
    "formation": "N + に / と + 比べて (N に比べると)",
    "confusables": [
      "～より (đơn giản hơn)",
      "～に対して (tương phản)",
      "～ほど～ない"
    ]
  },
  {
    "id": "GRAMMAR-0016",
    "stt": 16,
    "category": "N3",
    "pattern": "～おかげで",
    "meaning": "Nhờ có...",
    "exampleJa": "仕事が早く済んだのは、友達が手伝ってくれたおかげだ。",
    "exampleVi": "Công việc xong sớm là nhờ bạn tôi đã giúp đỡ.",
    "freq": 4,
    "context": "Kết quả tốt, thể hiện lòng biết ơn nguyên nhân.",
    "formation": "Vた / Vる / Aい / Aなな / N の + おかげで",
    "confusables": [
      "～せいで (kết quả xấu)",
      "～ために",
      "～によって"
    ]
  },
  {
    "id": "GRAMMAR-0017",
    "stt": 17,
    "category": "N3",
    "pattern": "Vます直す",
    "meaning": "Làm lại...",
    "exampleJa": "書き直します。",
    "exampleVi": "Tôi sẽ viết lại.",
    "freq": 4,
    "context": "Làm lại một hành động vì chưa ưng ý / bị sai.",
    "formation": "Vます bỏ ます + 直す",
    "confusables": [
      "～やり直す (làm lại từ đầu)",
      "～もう一度～",
      "～かえる"
    ]
  },
  {
    "id": "GRAMMAR-0018",
    "stt": 18,
    "category": "N3",
    "pattern": "～たまま",
    "meaning": "Cứ (giữ nguyên)...",
    "exampleJa": "テレビをつけたまま寝てしまった。",
    "exampleVi": "Tôi lỡ ngủ quên trong khi vẫn bật tivi.",
    "freq": 4,
    "context": "Trạng thái giữ nguyên trong khi làm hành động khác (thường ngoài ý muốn).",
    "formation": "Vた / Vない / Aい / N の + まま",
    "confusables": [
      "～ながら (đồng thời)",
      "～っぱなし (bỏ mặc",
      "tiêu cực)",
      "～ままで"
    ]
  },
  {
    "id": "GRAMMAR-0019",
    "stt": 19,
    "category": "N3",
    "pattern": "～たほうがいい",
    "meaning": "Nên làm ~ thì tốt hơn",
    "exampleJa": "早く寝たほうがいいよ。",
    "exampleVi": "Cậu nên đi ngủ sớm thì tốt hơn.",
    "freq": 4,
    "context": "Khuyên bảo, đề xuất.",
    "formation": "Vた + ほうがいい; phủ định: Vない + ほうがいい",
    "confusables": [
      "～べきだ (mạnh hơn)",
      "～たらどう (gợi ý nhẹ)",
      "Vる + ほうがいい (nghĩa chung chung)"
    ]
  },
  {
    "id": "GRAMMAR-0020",
    "stt": 20,
    "category": "N3",
    "pattern": "～間に",
    "meaning": "Trong khi / trong lúc",
    "exampleJa": "父が昼寝している間に、買い物に行った。",
    "exampleVi": "Trong khi bố đang ngủ trưa, tôi đã đi mua đồ.",
    "freq": 4,
    "context": "Hành động B (một lần) xảy ra trong khoảng thời gian trạng thái A đang diễn ra.",
    "formation": "Vている / Aい / Aなな / N の + 間に",
    "confusables": [
      "～間 (suốt khoảng thời gian",
      "liên tục)",
      "～うちに",
      "～ているうちに"
    ]
  },
  {
    "id": "GRAMMAR-0021",
    "stt": 21,
    "category": "N3",
    "pattern": "～だって",
    "meaning": "Ngay cả / thậm chí / chính... cũng",
    "exampleJa": "子供だってわかるよ。",
    "exampleVi": "Ngay cả trẻ con cũng hiểu mà.",
    "freq": 4,
    "context": "Hội thoại: nêu ví dụ cực đoan để nhấn mạnh.",
    "formation": "N + だって (không đi với が / を)",
    "confusables": [
      "～でも",
      "～さえ",
      "～も; だって đầu câu = \"vì...\" (biện minh)"
    ]
  },
  {
    "id": "GRAMMAR-0022",
    "stt": 22,
    "category": "N3",
    "pattern": "～に比べて",
    "meaning": "So với... thì...",
    "exampleJa": "去年に比べて、今年は暑い。",
    "exampleVi": "So với năm ngoái thì năm nay nóng hơn.",
    "freq": 4,
    "context": "So sánh.",
    "formation": "N + に比べて",
    "confusables": [
      "～と比べて",
      "～より"
    ]
  },
  {
    "id": "GRAMMAR-0023",
    "stt": 23,
    "category": "N3",
    "pattern": "～てはいけない",
    "meaning": "Không được làm..",
    "exampleJa": "ここでタバコを吸ってはいけません。",
    "exampleVi": "Không được hút thuốc ở đây.",
    "freq": 4,
    "context": "Cấm đoán, biển báo, quy định.",
    "formation": "Vて + はいけない (hội thoại: ちゃいけない)",
    "confusables": [
      "～てはならない (văn viết)",
      "～ないでください",
      "～なくてはいけない (phải làm)"
    ]
  },
  {
    "id": "GRAMMAR-0024",
    "stt": 24,
    "category": "N3",
    "pattern": "～として",
    "meaning": "Với tư cách là.../Dưới danh nghĩa là...",
    "exampleJa": "この学校は地震の時、避難する場所として使われる。",
    "exampleVi": "Trường học này được sử dụng làm nơi trú ẩn khi xảy ra động đất.",
    "freq": 3,
    "context": "Nêu vai trò / chức năng / tư cách của người hay vật.",
    "formation": "N + として (N としての N)",
    "confusables": [
      "～にとって (đối với)",
      "～とする",
      "～としても (dù là)"
    ]
  },
  {
    "id": "GRAMMAR-0025",
    "stt": 25,
    "category": "N3",
    "pattern": "～だけでなく",
    "meaning": "Không chỉ.../Không những...mà còn..",
    "exampleJa": "今日は風が強いばかりでなく、雨も降るそうだ。",
    "exampleVi": "Nghe nói hôm nay không chỉ có gió mạnh mà còn có cả mưa nữa.",
    "freq": 3,
    "context": "Bổ sung thêm thông tin cùng loại.",
    "formation": "Vる / Aい / Aな / N + だけでなく～も",
    "confusables": [
      "～ばかりでなく (nhấn mạnh hơn)",
      "～のみならず (văn viết)",
      "～だけ"
    ]
  },
  {
    "id": "GRAMMAR-0026",
    "stt": 26,
    "category": "N3",
    "pattern": "～より・よりも",
    "meaning": "So với việc làm V thì...hơn",
    "exampleJa": "メールより電話のほうが早い。",
    "exampleVi": "Gọi điện thoại thì nhanh hơn gửi mail.",
    "freq": 3,
    "context": "So sánh; thường đi cùng ～のほうが.",
    "formation": "N / Vる + より(も)",
    "confusables": [
      "～に比べて",
      "～ほど～ない",
      "～ほうが"
    ]
  },
  {
    "id": "GRAMMAR-0027",
    "stt": 27,
    "category": "N3",
    "pattern": "～せっかく～だから",
    "meaning": "Đã mất công... thì ...",
    "exampleJa": "せっかくのチャンスだから、全力で頑張ろう。",
    "exampleVi": "Vì cơ hội quý giá, nên hãy cố gắng hết sức.",
    "freq": 3,
    "context": "Cơ hội / công sức đáng quý nên đề nghị tận dụng.",
    "formation": "せっかく + (の) + N/V + だから / ので + ý chí, đề nghị",
    "confusables": [
      "せっかく～のに (thất vọng)",
      "せっかく～たのに"
    ]
  },
  {
    "id": "GRAMMAR-0028",
    "stt": 28,
    "category": "N3",
    "pattern": "～せいで",
    "meaning": "Do... mà... (mang sắc thái tiêu cực)",
    "exampleJa": "風邪をひいたせいで、頭が痛い。",
    "exampleVi": "Vì bị cảm nên tôi đau đầu.",
    "freq": 3,
    "context": "Nguyên nhân dẫn đến kết quả xấu; đổ lỗi.",
    "formation": "Vた / Vる / Aい / Aなな / N の + せいで",
    "confusables": [
      "～おかげで (kết quả tốt)",
      "～ために",
      "～から"
    ]
  },
  {
    "id": "GRAMMAR-0029",
    "stt": 29,
    "category": "N3",
    "pattern": "～に対して・に対する",
    "meaning": "Đối với...",
    "exampleJa": "お客様に対して、失礼なことを言ってはいけません。",
    "exampleVi": "Không được phép nói những lời thất lễ với khách hàng.",
    "freq": 3,
    "context": "Hướng tới đối tượng của hành động / thái độ; hoặc đối lập (～のに対して).",
    "formation": "N + に対して; N に対する + N",
    "confusables": [
      "～にとって (quan điểm)",
      "～について (về)",
      "～に関して"
    ]
  },
  {
    "id": "GRAMMAR-0030",
    "stt": 30,
    "category": "N3",
    "pattern": "～ずに",
    "meaning": "Không...",
    "exampleJa": "朝ごはんを食べずに学校へ行った。",
    "exampleVi": "Tôi đi học mà không ăn sáng.",
    "freq": 3,
    "context": "Làm B mà không làm A (văn viết / cứng hơn ないで).",
    "formation": "Vない bỏ ない + ずに (する → せずに)",
    "confusables": [
      "～ないで",
      "～なくて",
      "～ず (liệt kê / nối câu)"
    ]
  },
  {
    "id": "GRAMMAR-0031",
    "stt": 31,
    "category": "N3",
    "pattern": "～ばかり",
    "meaning": "Chỉ toàn...",
    "exampleJa": "甘いものばかり食べていると、太りますよ。",
    "exampleVi": "Toàn ăn đồ ngọt thì sẽ béo đấy.",
    "freq": 3,
    "context": "Chỉ làm / chỉ có một thứ (thường bị chê, quá nhiều).",
    "formation": "N + ばかり; Vて + ばかり + いる",
    "confusables": [
      "～だけ (trung tính)",
      "～たばかり (vừa mới)",
      "～ばかりか (hơn thế nữa)"
    ]
  },
  {
    "id": "GRAMMAR-0032",
    "stt": 32,
    "category": "N3",
    "pattern": "～一方",
    "meaning": "1. Mặt khác.../Trái lại... 2. Ngày càng...",
    "exampleJa": "この町は便利な一方で、自然が少ない。",
    "exampleVi": "Thị trấn này tiện lợi, nhưng mặt khác lại thiếu thiên nhiên.",
    "freq": 3,
    "context": "(1) Nêu hai mặt đối lập; (2) xu hướng thay đổi một chiều.",
    "formation": "(1) Vる / Aい / Aなな / N である + 一方(で); (2) Vる + 一方だ",
    "confusables": [
      "～に対して (tương phản)",
      "～反面",
      "～つつある (đang dần)"
    ]
  },
  {
    "id": "GRAMMAR-0033",
    "stt": 33,
    "category": "N3",
    "pattern": "～みたい",
    "meaning": "1. Như là... (ví dụ tiêu biểu) 2. Hình như là... (phán đoán) 3. Như... (so sánh, ví von)",
    "exampleJa": "外は雨が降っているみたいだ。",
    "exampleVi": "Hình như bên ngoài đang mưa.",
    "freq": 3,
    "context": "Hội thoại: phỏng đoán, so sánh, đưa ví dụ.",
    "formation": "Thể thường (Na và N bỏ だ) + みたい(だ)",
    "confusables": [
      "～ようだ (trang trọng hơn)",
      "～らしい (nghe nói / đúng nghĩa)",
      "～そうだ"
    ]
  },
  {
    "id": "GRAMMAR-0034",
    "stt": 34,
    "category": "N3",
    "pattern": "Vます続ける",
    "meaning": "Tiếp tục (làm gì đó)",
    "exampleJa": "彼は10年間会社で働き続けている。",
    "exampleVi": "Anh ấy đã làm việc liên tục ở công ty suốt 10 năm.",
    "freq": 3,
    "context": "Hành động diễn ra liên tục trong thời gian dài.",
    "formation": "Vます bỏ ます + 続ける",
    "confusables": [
      "～ている (trạng thái)",
      "～づける (tha động từ có sẵn như 続ける)"
    ]
  },
  {
    "id": "GRAMMAR-0035",
    "stt": 35,
    "category": "N3",
    "pattern": "～のだから・んだから",
    "meaning": "Vì... nên đương nhiên / vì lý do rõ ràng nên...",
    "exampleJa": "子供なんだから、泣いてもいいよ。",
    "exampleVi": "Vì là trẻ con nên có khóc cũng được mà.",
    "freq": 3,
    "context": "Nhấn mạnh lý do hiển nhiên mà người nghe đã biết, rồi đưa ra đề nghị / kết luận.",
    "formation": "Thể thường (Naな, N な) + のだから / んだから",
    "confusables": [
      "～から",
      "～ので (nhẹ nhàng hơn)",
      "～だけに"
    ]
  },
  {
    "id": "GRAMMAR-0036",
    "stt": 36,
    "category": "N3",
    "pattern": "～だろう",
    "meaning": "Có lẽ / chắc là",
    "exampleJa": "明日は雨が降るだろう。",
    "exampleVi": "Có lẽ ngày mai trời sẽ mưa.",
    "freq": 3,
    "context": "Phỏng đoán của người nói về điều chưa chắc chắn; văn viết, dự báo thời tiết.",
    "formation": "Thể thường (Na và N bỏ だ) + だろう; lịch sự: でしょう",
    "confusables": [
      "～かもしれない (khả năng thấp hơn)",
      "～に違いない (chắc hơn)",
      "～と思う"
    ]
  },
  {
    "id": "GRAMMAR-0037",
    "stt": 37,
    "category": "N3",
    "pattern": "～ことになっている",
    "meaning": "Được quyết định.../Quy định là...",
    "exampleJa": "今日は10時に歯医者へ行くことになっている。",
    "exampleVi": "Hôm nay tôi có lịch đi nha sĩ lúc 10 giờ.",
    "freq": 2,
    "context": "Lịch trình, quy định, luật lệ (không phải do bản thân quyết).",
    "formation": "Vる / Vない + ことになっている",
    "confusables": [
      "～ことにしている (tự quyết thói quen)",
      "～ことになった (kết quả được quyết định)"
    ]
  },
  {
    "id": "GRAMMAR-0038",
    "stt": 38,
    "category": "N3",
    "pattern": "～ように",
    "meaning": "1. (Ai đó) nói truyền đạt/nhắc nhở... 2. Mong là.../Ước là...",
    "exampleJa": "合格できますように。",
    "exampleVi": "Mong là mình sẽ đỗ.",
    "freq": 2,
    "context": "(1) Nhờ / dặn người khác làm gì; (2) lời cầu chúc, ước nguyện.",
    "formation": "Vる / Vない + ように (+ 言う / 頼む / 祈る)",
    "confusables": [
      "～ように (mục đích)",
      "～ようにする",
      "～ように (như",
      "giống như)"
    ]
  },
  {
    "id": "GRAMMAR-0039",
    "stt": 39,
    "category": "N3",
    "pattern": "～について",
    "meaning": "Về.../ Liên quan đến...",
    "exampleJa": "日本の文化について勉強しています。",
    "exampleVi": "Tôi đang học về văn hóa Nhật Bản.",
    "freq": 2,
    "context": "Chủ đề của việc nói, nghĩ, điều tra, học.",
    "formation": "N + について (N についての N)",
    "confusables": [
      "～に対して (đối tượng hướng tới)",
      "～に関して (trang trọng)",
      "～をめぐって"
    ]
  },
  {
    "id": "GRAMMAR-0040",
    "stt": 40,
    "category": "N3",
    "pattern": "～としても",
    "meaning": "Dù cho / cho dù",
    "exampleJa": "努力しても、合格できないこともある。",
    "exampleVi": "Dù có cố gắng cũng có lúc không đậu.",
    "freq": 2,
    "context": "Giả định nhượng bộ: dù thừa nhận điều A thì kết quả B vẫn không đổi. (Chú ý: ví dụ trong bảng là dạng ～ても)",
    "formation": "Thể thường + としても (Na và N bỏ だ)",
    "confusables": [
      "～ても (dù)",
      "～としたら (nếu giả sử)",
      "～にしても",
      "～として"
    ]
  },
  {
    "id": "GRAMMAR-0041",
    "stt": 41,
    "category": "N3",
    "pattern": "～ば～ほど",
    "meaning": "Càng... càng...",
    "exampleJa": "勉強すればするほど、日本語が上手になる。",
    "exampleVi": "Càng học thì càng giỏi tiếng Nhật.",
    "freq": 2,
    "context": "Mức độ ở vế sau thay đổi tương ứng với vế trước.",
    "formation": "V ば + V る + ほど; Aければ + Aい + ほど; Naなら(ば) + Na + ほど; Nなら + N + ほど",
    "confusables": [
      "～につれて",
      "～にしたがって (thay đổi dần)",
      "～ほど (mức độ)"
    ]
  },
  {
    "id": "GRAMMAR-0042",
    "stt": 42,
    "category": "N3",
    "pattern": "～ほど～ない",
    "meaning": "Không đến mức / không bằng...",
    "exampleJa": "今日は昨日ほど寒くない。",
    "exampleVi": "Hôm nay không lạnh bằng hôm qua.",
    "freq": 2,
    "context": "So sánh với kết quả phủ định.",
    "formation": "N / Vる + ほど + Aくない / Vない",
    "confusables": [
      "～より～ない (không dùng được)",
      "～ほど (mức độ)",
      "～ぐらい"
    ]
  },
  {
    "id": "GRAMMAR-0043",
    "stt": 43,
    "category": "N3",
    "pattern": "～を中心に",
    "meaning": "Lấy... làm trung tâm/ Chủ yếu là...",
    "exampleJa": "この会社は若い人を中心に活動している。",
    "exampleVi": "Công ty này hoạt động chủ yếu là người trẻ.",
    "freq": 2,
    "context": "Nêu tâm điểm / đối tượng chính của hoạt động.",
    "formation": "N + を中心に(して) / N を中心として",
    "confusables": [
      "～を中心とする N",
      "～を通して",
      "～をはじめ"
    ]
  },
  {
    "id": "GRAMMAR-0044",
    "stt": 44,
    "category": "N3",
    "pattern": "Vます始める",
    "meaning": "Bắt đầu (làm gì đó)",
    "exampleJa": "雨が降り始めた。",
    "exampleVi": "Trời bắt đầu mưa.",
    "freq": 2,
    "context": "Bắt đầu một hành động / hiện tượng diễn tiến.",
    "formation": "Vます bỏ ます + 始める",
    "confusables": [
      "～出す (đột ngột)",
      "～かける (làm dở)",
      "～ようになる"
    ]
  },
  {
    "id": "GRAMMAR-0045",
    "stt": 45,
    "category": "N3",
    "pattern": "～らしい",
    "meaning": "1. Nghe nói... 2. Đúng kiểu.../ Đúng nghĩa...",
    "exampleJa": "彼は男らしい人だ。",
    "exampleVi": "Anh ấy đúng chất đàn ông.",
    "freq": 2,
    "context": "(1) Suy đoán / nghe nói dựa trên thông tin gián tiếp; (2) đúng đặc trưng điển hình của N.",
    "formation": "Thể thường (Na và N bỏ だ) + らしい; N + らしい (tính từ -い)",
    "confusables": [
      "～そうだ (nghe nói)",
      "～ようだ (suy đoán từ quan sát trực tiếp)",
      "～みたい",
      "～っぽい"
    ]
  },
  {
    "id": "GRAMMAR-0046",
    "stt": 46,
    "category": "N3",
    "pattern": "～のほか",
    "meaning": "Ngoài... ra",
    "exampleJa": "日本語のほかに、英語も話せます。",
    "exampleVi": "Ngoài tiếng Nhật, tôi còn nói được tiếng Anh.",
    "freq": 2,
    "context": "Bổ sung thêm cái khác ngoài cái đã nêu (thường đi với に / も).",
    "formation": "N + のほかに(も) ; Vる + ほかない = chỉ còn cách phải làm",
    "confusables": [
      "～以外",
      "～のみならず",
      "～ほか(は)ない (hết cách)"
    ]
  },
  {
    "id": "GRAMMAR-0047",
    "stt": 47,
    "category": "N3",
    "pattern": "～ことがある",
    "meaning": "Thỉnh thoảng / có lúc",
    "exampleJa": "時々、テレビをつけたまま寝てしまうことがあります。",
    "exampleVi": "Thỉnh thoảng tôi vẫn bật tivi mà ngủ quên.",
    "freq": 2,
    "context": "Thỉnh thoảng sự việc xảy ra (Vる); hoặc từng có kinh nghiệm (Vた).",
    "formation": "Vる / Vない + ことがある (thỉnh thoảng); Vた + ことがある (từng)",
    "confusables": [
      "～ことになる",
      "～こともある",
      "～たことがない"
    ]
  },
  {
    "id": "GRAMMAR-0048",
    "stt": 48,
    "category": "N3",
    "pattern": "～ていく",
    "meaning": "1. Vật, hiện tượng đi xa khỏi chỗ hiện tại 2. Hành động tiếp diễn trong tương lai",
    "exampleJa": "これからも日本語を勉強していきます。",
    "exampleVi": "Từ nay tôi sẽ tiếp tục học tiếng Nhật.",
    "freq": 2,
    "context": "Di chuyển ra xa / thay đổi hướng tương lai.",
    "formation": "Vて + いく",
    "confusables": [
      "～てくる (hướng về người nói / từ quá khứ đến nay)",
      "～ていく (đi rồi về là 行ってくる)"
    ]
  },
  {
    "id": "GRAMMAR-0049",
    "stt": 49,
    "category": "N3",
    "pattern": "～にしたがって",
    "meaning": "1. Càng... thì càng 2. Theo như...",
    "exampleJa": "年を取るにしたがって、体力がなくなる。",
    "exampleVi": "Càng lớn tuổi thì càng mất sức.",
    "freq": 2,
    "context": "Biến đổi song song (văn viết); hoặc làm theo chỉ dẫn / quy tắc.",
    "formation": "Vる / N + にしたがって",
    "confusables": [
      "～につれて",
      "～とともに",
      "～ば～ほど",
      "～に応じて"
    ]
  },
  {
    "id": "GRAMMAR-0050",
    "stt": 50,
    "category": "N3",
    "pattern": "～ことではない",
    "meaning": "Không cần phải / không nhất thiết phải...",
    "exampleJa": "焦ることではない。少し休もう。",
    "exampleVi": "Không cần phải vội đâu, nghỉ một chút đi.",
    "freq": 2,
    "context": "Khuyên người khác không cần lo / làm việc gì.",
    "formation": "Vる + ことではない",
    "confusables": [
      "～ことはない (ngắn gọn)",
      "～わけではない",
      "～ものではない"
    ]
  },
  {
    "id": "GRAMMAR-0051",
    "stt": 51,
    "category": "N3",
    "pattern": "Vちゃう",
    "meaning": "Lỡ làm / làm xong mất rồi",
    "exampleJa": "宿題を忘れちゃった。",
    "exampleVi": "Lỡ quên mất bài tập rồi.",
    "freq": 2,
    "context": "Hội thoại: tiếc nuối hoặc hoàn thành hẳn.",
    "formation": "Vて → ちゃう (Vで → じゃう); quá khứ: ちゃった",
    "confusables": [
      "～てしまう (dạng đầy đủ)",
      "～ておく",
      "～ちゃだめ = ～てはいけない"
    ]
  },
  {
    "id": "GRAMMAR-0052",
    "stt": 52,
    "category": "N3",
    "pattern": "～はずがない",
    "meaning": "Chắc chắn không thể / không đời nào mà...",
    "exampleJa": "彼がそんなことを言うはずがない。",
    "exampleVi": "Không đời nào anh ấy nói điều đó.",
    "freq": 2,
    "context": "Phủ nhận mạnh dựa trên căn cứ logic.",
    "formation": "Thể thường (Naな, Nの) + はずがない",
    "confusables": [
      "～はずだ",
      "～わけがない (gần nghĩa)",
      "～ないはずだ (đáng ra không)"
    ]
  },
  {
    "id": "GRAMMAR-0053",
    "stt": 53,
    "category": "N3",
    "pattern": "～なんて・なんか・など",
    "meaning": "1. Cái gọi là... (đưa ví dụ) 2. Mấy thứ như... (coi nhẹ)",
    "exampleJa": "彼が会社を辞めるなんて、信じられない。",
    "exampleVi": "Không thể tin được là anh ấy nghỉ việc.",
    "freq": 2,
    "context": "Ngạc nhiên / coi thường / nêu ví dụ.",
    "formation": "N / Thể thường + なんて / なんか / など",
    "confusables": [
      "～など (văn viết)",
      "～なんか (khẩu ngữ)",
      "～とは",
      "～でも"
    ]
  },
  {
    "id": "GRAMMAR-0054",
    "stt": 54,
    "category": "N3",
    "pattern": "～ことから",
    "meaning": "Vì... nên / từ việc... mà...",
    "exampleJa": "富士山が見えることから、この町は人気がある。",
    "exampleVi": "Vì có thể nhìn thấy núi Phú Sĩ nên thị trấn này nổi tiếng.",
    "freq": 2,
    "context": "Nêu căn cứ để phán đoán hoặc nguồn gốc tên gọi.",
    "formation": "Thể thường (Naな, N である) + ことから",
    "confusables": [
      "～ので",
      "～から",
      "～ために",
      "～ことで"
    ]
  },
  {
    "id": "GRAMMAR-0055",
    "stt": 55,
    "category": "N3",
    "pattern": "～ようにしている",
    "meaning": "Cố gắng làm gì đó (như một thói quen)",
    "exampleJa": "毎日野菜を食べるようにしている。",
    "exampleVi": "Tôi cố gắng ăn rau mỗi ngày.",
    "freq": 2,
    "context": "Nỗ lực duy trì thói quen có chủ ý.",
    "formation": "Vる / Vない + ようにしている",
    "confusables": [
      "～ことにしている (quy tắc tự đặt)",
      "～ようにする (sẽ cố gắng)",
      "～ようになる"
    ]
  },
  {
    "id": "GRAMMAR-0056",
    "stt": 56,
    "category": "N3",
    "pattern": "Vます出す",
    "meaning": "Bắt đầu làm gì (đột ngột, bất ngờ)",
    "exampleJa": "急に雨が降り出した。",
    "exampleVi": "Trời đột nhiên bắt đầu mưa.",
    "freq": 2,
    "context": "Bắt đầu bất ngờ, thường không có ý chí.",
    "formation": "Vます bỏ ます + 出す",
    "confusables": [
      "～始める (trung tính)",
      "～かける"
    ]
  },
  {
    "id": "GRAMMAR-0057",
    "stt": 57,
    "category": "N3",
    "pattern": "～のに対して",
    "meaning": "Trái lại với / Ngược lại với",
    "exampleJa": "都会の生活が便利なのに対して、田舎の生活はのんびりしている。",
    "exampleVi": "Trái với cuộc sống tiện lợi ở thành phố, cuộc sống ở nông thôn thong thả hơn.",
    "freq": 2,
    "context": "Đối lập hai sự việc.",
    "formation": "Thể thường (Naな, N な) + のに対して",
    "confusables": [
      "～に対して (hướng tới)",
      "～一方で",
      "～反面"
    ]
  },
  {
    "id": "GRAMMAR-0058",
    "stt": 58,
    "category": "N3",
    "pattern": "～ことにしている",
    "meaning": "Quyết định...",
    "exampleJa": "毎朝ジョギングをすることにしている。",
    "exampleVi": "Tôi quyết định chạy bộ mỗi sáng.",
    "freq": 2,
    "context": "Quy tắc / thói quen bản thân tự đặt ra và duy trì.",
    "formation": "Vる / Vない + ことにしている",
    "confusables": [
      "～ことになっている (do bên ngoài)",
      "～ようにしている",
      "～ことにする"
    ]
  },
  {
    "id": "GRAMMAR-0059",
    "stt": 59,
    "category": "N3",
    "pattern": "～まで",
    "meaning": "Đến, cho đến",
    "exampleJa": "明日までにレポートを出してください。",
    "exampleVi": "Hãy nộp báo cáo trước ngày mai.",
    "freq": 2,
    "context": "Giới hạn thời gian / địa điểm / mức độ của hành động liên tục.",
    "formation": "N / Vる + まで (Vる + まで + に = trước khi)",
    "confusables": [
      "～までに (hạn chót)",
      "～まで (liên tục)",
      "～までも"
    ]
  },
  {
    "id": "GRAMMAR-0060",
    "stt": 60,
    "category": "N3",
    "pattern": "～たらいい",
    "meaning": "Nên... thì tốt / Nếu... thì hay",
    "exampleJa": "早く夏休みになったらいいな。",
    "exampleVi": "Giá mà mau đến kỳ nghỉ hè thì tốt quá.",
    "freq": 2,
    "context": "Gợi ý lời khuyên hoặc mong ước.",
    "formation": "Vた + らいい(のに / な)",
    "confusables": [
      "～ばいい (cách làm)",
      "～といい",
      "～たほうがいい"
    ]
  },
  {
    "id": "GRAMMAR-0061",
    "stt": 61,
    "category": "N3",
    "pattern": "～つもり",
    "meaning": "Dự định làm gì",
    "exampleJa": "来年日本へ行くつもりです。",
    "exampleVi": "Tôi dự định sang Nhật vào năm sau.",
    "freq": 2,
    "context": "Ý định đã khá chắc chắn của bản thân.",
    "formation": "Vる / Vない + つもり; Vた + つもり = tưởng là đã (làm)",
    "confusables": [
      "～予定",
      "～ようと思う",
      "～ことにする"
    ]
  },
  {
    "id": "GRAMMAR-0062",
    "stt": 62,
    "category": "N3",
    "pattern": "～なくてもいい",
    "meaning": "Không cần làm gì cũng được",
    "exampleJa": "無理して行かなくてもいいよ。",
    "exampleVi": "Không cần cố gắng đi đâu.",
    "freq": 2,
    "context": "Cho phép không phải làm, miễn trừ nghĩa vụ.",
    "formation": "Vない bỏ い + くてもいい",
    "confusables": [
      "～なくてはいけない (phải làm)",
      "～てもいい (được phép)",
      "～なくてもかまわない"
    ]
  },
  {
    "id": "GRAMMAR-0063",
    "stt": 63,
    "category": "N3",
    "pattern": "～ことで",
    "meaning": "Bằng việc / Nhờ việc",
    "exampleJa": "毎日少しずつ勉強することで、上達できます。",
    "exampleVi": "Bằng việc học mỗi ngày một chút, bạn có thể tiến bộ.",
    "freq": 2,
    "context": "Phương pháp / nguyên nhân dẫn đến kết quả.",
    "formation": "Vる / Vた + ことで",
    "confusables": [
      "～によって",
      "～ために",
      "～ので"
    ]
  },
  {
    "id": "GRAMMAR-0064",
    "stt": 64,
    "category": "N3",
    "pattern": "～としたら",
    "meaning": "Giả sử / Nếu... thì",
    "exampleJa": "もし明日雨だとしたら、試合は中止です。",
    "exampleVi": "Nếu mai trời mưa thì trận đấu sẽ bị hoãn.",
    "freq": 2,
    "context": "Giả định chưa có thật; đưa ra kết luận / đề xuất.",
    "formation": "Thể thường + としたら (Na và N bỏ だ)",
    "confusables": [
      "～とすれば",
      "～なら",
      "～たら (giả định thông thường)"
    ]
  },
  {
    "id": "GRAMMAR-0065",
    "stt": 65,
    "category": "N3",
    "pattern": "～はず",
    "meaning": "Chắc chắn là...",
    "exampleJa": "彼は今出かけたはずです。",
    "exampleVi": "Anh ấy chắc là vừa mới ra ngoài.",
    "freq": 2,
    "context": "Suy đoán có căn cứ chắc chắn của người nói.",
    "formation": "Thể thường (Naな, Nの) + はず",
    "confusables": [
      "～に違いない",
      "～だろう",
      "～つもり"
    ]
  },
  {
    "id": "GRAMMAR-0066",
    "stt": 66,
    "category": "N3",
    "pattern": "～とか",
    "meaning": "Như là... / Hoặc là...",
    "exampleJa": "週末は映画を見るとか、買い物に行くとかします。",
    "exampleVi": "Cuối tuần tôi xem phim hoặc đi mua sắm chẳng hạn.",
    "freq": 2,
    "context": "Liệt kê ví dụ (hội thoại).",
    "formation": "Thể thường + とか + Thể thường + とか",
    "confusables": [
      "～や～など",
      "～たり～たり",
      "～か"
    ]
  },
  {
    "id": "GRAMMAR-0067",
    "stt": 67,
    "category": "N3",
    "pattern": "～間",
    "meaning": "Trong khi / suốt khoảng thời gian",
    "exampleJa": "さんぽしている間、ずっと雨が降っていた。",
    "exampleVi": "Trời mưa suốt trong lúc tôi đang đi dạo.",
    "freq": 1,
    "context": "Hành động / trạng thái diễn ra liên tục suốt khoảng thời gian.",
    "formation": "Vている / Aい / Aなな / N の + 間",
    "confusables": [
      "～間に (một lần trong khoảng đó)",
      "～うちに"
    ]
  },
  {
    "id": "GRAMMAR-0068",
    "stt": 68,
    "category": "N3",
    "pattern": "～ことか",
    "meaning": "Biết bao nhiêu / cực kỳ",
    "exampleJa": "彼に会いたかったことか。",
    "exampleVi": "Tôi đã muốn gặp anh ấy biết bao nhiêu.",
    "freq": 1,
    "context": "Cảm thán mạnh, thường đi với どんなに / 何度 / どれだけ.",
    "formation": "Thể thường (Naな) + ことか",
    "confusables": [
      "～ものか (phản bác)",
      "～ことだ",
      "～か"
    ]
  },
  {
    "id": "GRAMMAR-0069",
    "stt": 69,
    "category": "N3",
    "pattern": "～ように",
    "meaning": "Như.../ Theo như...",
    "exampleJa": "皆様ご存じのように、試験の内容が変わります。",
    "exampleVi": "Như mọi người đã biết thì nội dung bài kiểm tra sẽ thay đổi.",
    "freq": 1,
    "context": "Nêu thông tin chung / điều đã nói / giống như.",
    "formation": "Vる / Vた / Vている / N の + ように",
    "confusables": [
      "～とおり",
      "～ように (mục đích)",
      "～ような N"
    ]
  },
  {
    "id": "GRAMMAR-0070",
    "stt": 70,
    "category": "N3",
    "pattern": "～よう",
    "meaning": "Giống như",
    "exampleJa": "夢のような話だ。",
    "exampleVi": "Là câu chuyện như trong mơ.",
    "freq": 1,
    "context": "So sánh, ví dụ.",
    "formation": "Thể thường (Na な, N の) + よう(だ)",
    "confusables": [
      "～みたい",
      "～らしい",
      "～そう"
    ]
  },
  {
    "id": "GRAMMAR-0071",
    "stt": 71,
    "category": "N3",
    "pattern": "～ぐらい",
    "meaning": "1. Khoảng 2. Cỡ 3. Đến mức",
    "exampleJa": "死ぬくらい疲れた。",
    "exampleVi": "Mệt đến mức như chết luôn.",
    "freq": 1,
    "context": "Ước lượng số lượng hoặc mức độ ví von.",
    "formation": "Số từ / N / Vる + ぐらい (くらい)",
    "confusables": [
      "～ほど (mức độ)",
      "～だけ",
      "～ほどの"
    ]
  },
  {
    "id": "GRAMMAR-0072",
    "stt": 72,
    "category": "N3",
    "pattern": "～ことはない",
    "meaning": "Không cần phải / không việc gì phải...",
    "exampleJa": "心配することはないよ。",
    "exampleVi": "Không cần phải lo đâu.",
    "freq": 1,
    "context": "Trấn an, khuyên đừng lo / làm.",
    "formation": "Vる + ことはない",
    "confusables": [
      "～ことではない",
      "～必要はない",
      "～ことがない (chưa từng)"
    ]
  },
  {
    "id": "GRAMMAR-0073",
    "stt": 73,
    "category": "N3",
    "pattern": "～ということだ／～とのことだ",
    "meaning": "Nghe nói là / có nghĩa là...",
    "exampleJa": "明日は休みだということです。",
    "exampleVi": "Nghe nói là ngày mai được nghỉ.",
    "freq": 1,
    "context": "Truyền đạt thông tin nghe được (văn viết, trang trọng).",
    "formation": "Thể thường + ということだ / とのことだ",
    "confusables": [
      "～そうだ",
      "～らしい",
      "～ということは (nghĩa là)"
    ]
  },
  {
    "id": "GRAMMAR-0074",
    "stt": 74,
    "category": "N3",
    "pattern": "せっかく～のに",
    "meaning": "Mất công... mà lại... (thất vọng, tiếc nuối)",
    "exampleJa": "せっかく作ったのに、誰も食べなかった。",
    "exampleVi": "Mất công nấu rồi mà chẳng ai ăn.",
    "freq": 1,
    "context": "Công sức bị uổng phí.",
    "formation": "せっかく + Thể thường (Naな, N な) + のに",
    "confusables": [
      "せっかく～から (tận dụng)",
      "～のに",
      "～たのに"
    ]
  },
  {
    "id": "GRAMMAR-0075",
    "stt": 75,
    "category": "N3",
    "pattern": "～にとって",
    "meaning": "Đối với....",
    "exampleJa": "私にとって、家族が一番大切です。",
    "exampleVi": "Đối với tôi, gia đình là quan trọng nhất.",
    "freq": 1,
    "context": "Nhận định theo lập trường.",
    "formation": "N + にとって",
    "confusables": [
      "～に対して",
      "～としては"
    ]
  },
  {
    "id": "GRAMMAR-0076",
    "stt": 76,
    "category": "N3",
    "pattern": "～とく",
    "meaning": "Làm sẵn / chuẩn bị trước（＝ておく）",
    "exampleJa": "明日のために資料を読んどく。",
    "exampleVi": "Đọc sẵn tài liệu cho ngày mai.",
    "freq": 1,
    "context": "Hội thoại: chuẩn bị trước.",
    "formation": "Vて + おく → とく (Vで + おく → どく)",
    "confusables": [
      "～ておく",
      "～てある",
      "～ちゃう"
    ]
  },
  {
    "id": "GRAMMAR-0077",
    "stt": 77,
    "category": "N3",
    "pattern": "Vます終わる",
    "meaning": "Làm xong / kết thúc việc gì đó",
    "exampleJa": "レポートを書き終わった。",
    "exampleVi": "Viết xong báo cáo rồi.",
    "freq": 1,
    "context": "Hoàn thành hẳn hành động.",
    "formation": "Vます bỏ ます + 終わる",
    "confusables": [
      "～てしまう",
      "～たところ",
      "～きる (làm hết)"
    ]
  },
  {
    "id": "GRAMMAR-0078",
    "stt": 78,
    "category": "N3",
    "pattern": "Vなきゃ",
    "meaning": "Phải... / nếu không...",
    "exampleJa": "早く行かなきゃ！",
    "exampleVi": "Phải đi nhanh thôi!",
    "freq": 1,
    "context": "Hội thoại: nghĩa vụ (rút gọn).",
    "formation": "Vない bỏ い + きゃ (＝なければ)",
    "confusables": [
      "～なくちゃ",
      "～なければならない",
      "～ないと"
    ]
  },
  {
    "id": "GRAMMAR-0079",
    "stt": 79,
    "category": "N3",
    "pattern": "～かと思う",
    "meaning": "Cứ tưởng là / ngỡ là / cảm thấy rằng...",
    "exampleJa": "もう終わったかと思った。",
    "exampleVi": "Cứ tưởng là xong rồi.",
    "freq": 1,
    "context": "Nhận định tạm thời, thường là nhầm hoặc nghi ngờ.",
    "formation": "Thể thường + かと思う / かと思った",
    "confusables": [
      "～と思う (nghĩ rằng",
      "chắc)",
      "～かもしれない",
      "～かどうか"
    ]
  },
  {
    "id": "GRAMMAR-0080",
    "stt": 80,
    "category": "N3",
    "pattern": "～だけに",
    "meaning": "Chính vì... nên... / Vì là... nên đặc biệt...",
    "exampleJa": "彼は努力家だけに、成功した。",
    "exampleVi": "Chính vì anh ấy chăm chỉ nên đã thành công.",
    "freq": 1,
    "context": "Kết quả tương xứng với đặc điểm (thường là khen).",
    "formation": "Thể thường (Naな / である, Nの) + だけに",
    "confusables": [
      "～だけあって",
      "～から",
      "～のだから"
    ]
  },
  {
    "id": "GRAMMAR-0081",
    "stt": 81,
    "category": "N3",
    "pattern": "～ほど",
    "meaning": "1. Khoảng 2. Đến mức/ cỡ 3. Không... bằng",
    "exampleJa": "足は泣きたいほど痛い。",
    "exampleVi": "Chân đau đến mức phát khóc.",
    "freq": 1,
    "context": "Mức độ ví von hoặc so sánh.",
    "formation": "Vる / N / Số từ + ほど",
    "confusables": [
      "～ぐらい",
      "～ほど～ない",
      "～ほどの"
    ]
  },
  {
    "id": "GRAMMAR-0082",
    "stt": 82,
    "category": "N3",
    "pattern": "～ようとしない",
    "meaning": "Không chịu làm / Không có ý định làm",
    "exampleJa": "彼は話そうとしない。",
    "exampleVi": "Anh ta không chịu nói.",
    "freq": 1,
    "context": "Phê phán thái độ phản kháng.",
    "formation": "Vよう + としない",
    "confusables": [
      "～ようとする",
      "～ない",
      "～がらない"
    ]
  },
  {
    "id": "GRAMMAR-0083",
    "stt": 83,
    "category": "N3",
    "pattern": "～による",
    "meaning": "1. Do / Bởi 2. Tùy theo / Phụ thuộc vào 3. Bằng cách / Thông qua",
    "exampleJa": "天気によると、明日は雨らしい。",
    "exampleVi": "Theo dự báo thời tiết, ngày mai có vẻ sẽ mưa.",
    "freq": 1,
    "context": "Nêu nguồn thông tin / nguyên nhân / phương tiện.",
    "formation": "N + による / によると",
    "confusables": [
      "～によって",
      "～によれば",
      "～に応じて"
    ]
  },
  {
    "id": "GRAMMAR-0084",
    "stt": 84,
    "category": "KINH_NGU",
    "pattern": "いただく",
    "meaning": "もらう / 食べる / 飲む: Nhận, ăn, uống (KNN)",
    "exampleJa": "先生から本をいただきました。",
    "exampleVi": "Tôi đã nhận sách từ thầy.",
    "freq": 5,
    "context": "Khiêm nhường ngữ: người nói nhận từ người trên.",
    "formation": "いただく → いただきます / いただいた",
    "confusables": [
      "くださる (người trên cho mình)",
      "もらう",
      "いただける"
    ]
  },
  {
    "id": "GRAMMAR-0085",
    "stt": 85,
    "category": "KINH_NGU",
    "pattern": "申し上げる",
    "meaning": "言う: Nói (khiêm nhường)",
    "exampleJa": "心からお礼を申し上げます。",
    "exampleVi": "Tôi xin gửi lời cảm ơn chân thành.",
    "freq": 5,
    "context": "Khiêm nhường ngữ: nói với người trên.",
    "formation": "申し上げる → 申し上げます",
    "confusables": [
      "申す (nói tên mình)",
      "おっしゃる (tôn kính)",
      "言います"
    ]
  },
  {
    "id": "GRAMMAR-0086",
    "stt": 86,
    "category": "KINH_NGU",
    "pattern": "ございます（あります）",
    "meaning": "ある: Có, tồn tại (lịch sự)",
    "exampleJa": "こちらにございます。",
    "exampleVi": "Cái này có ở đây.",
    "freq": 4,
    "context": "Rất lịch sự trong dịch vụ / khách hàng.",
    "formation": "ございます (dạng ます của ござる); phủ định: ございません",
    "confusables": [
      "です → でございます",
      "あります",
      "います"
    ]
  },
  {
    "id": "GRAMMAR-0087",
    "stt": 87,
    "category": "KINH_NGU",
    "pattern": "いたす",
    "meaning": "する: Làm (khiêm nhường)",
    "exampleJa": "私が準備いたします。",
    "exampleVi": "Tôi sẽ chuẩn bị.",
    "freq": 4,
    "context": "Người nói tự làm việc gì với thái độ khiêm tốn; thư từ, dịch vụ.",
    "formation": "いたす → いたします; N + いたす (ご連絡いたします)",
    "confusables": [
      "なさる (tôn kính)",
      "します",
      "させていただく"
    ]
  },
  {
    "id": "GRAMMAR-0088",
    "stt": 88,
    "category": "KINH_NGU",
    "pattern": "いらっしゃる",
    "meaning": "行く / 来る / いる: Đi / đến / ở (TKN)",
    "exampleJa": "社長はいらっしゃいますか。",
    "exampleVi": "Giám đốc có ở đây không?",
    "freq": 4,
    "context": "Tôn kính ngữ: hành động của người trên.",
    "formation": "いらっしゃる → いらっしゃいます (ます bất quy tắc: いらっしゃいます)",
    "confusables": [
      "いる / おる",
      "参る",
      "おいでになる"
    ]
  },
  {
    "id": "GRAMMAR-0089",
    "stt": 89,
    "category": "KINH_NGU",
    "pattern": "おる",
    "meaning": "いる: Ở (khiêm nhường)",
    "exampleJa": "私は東京におります。",
    "exampleVi": "Tôi đang ở Tokyo.",
    "freq": 4,
    "context": "Khiêm nhường: nói về bản thân / người trong nhóm mình.",
    "formation": "おる → おります / おりません; Vておる = Vている (khiêm nhường)",
    "confusables": [
      "いらっしゃる (tôn kính)",
      "います"
    ]
  },
  {
    "id": "GRAMMAR-0090",
    "stt": 90,
    "category": "KINH_NGU",
    "pattern": "おVますになります",
    "meaning": "Vます: Làm (TKN)",
    "exampleJa": "部長がお書きになります。",
    "exampleVi": "Trưởng phòng viết.",
    "freq": 3,
    "context": "Tôn kính: hành động của người trên.",
    "formation": "お + Vます bỏ ます + になる",
    "confusables": [
      "ご + N + になる (ご覧になる)",
      "Vれる/られる (tôn kính dạng bị động)",
      "お～ください"
    ]
  },
  {
    "id": "GRAMMAR-0091",
    "stt": 91,
    "category": "KINH_NGU",
    "pattern": "でございます（です）",
    "meaning": "です: Là (lịch sự)",
    "exampleJa": "これはペンでございます。",
    "exampleVi": "Đây là bút.",
    "freq": 3,
    "context": "Rất lịch sự trong dịch vụ.",
    "formation": "N + でございます",
    "confusables": [
      "であります",
      "です",
      "でいらっしゃいます"
    ]
  },
  {
    "id": "GRAMMAR-0092",
    "stt": 92,
    "category": "KINH_NGU",
    "pattern": "参る",
    "meaning": "行く / 来る: Đi / đến (khiêm nhường)",
    "exampleJa": "私が先に参ります。",
    "exampleVi": "Tôi sẽ đi trước.",
    "freq": 3,
    "context": "Khiêm nhường: người nói đi / đến.",
    "formation": "参る → 参ります",
    "confusables": [
      "伺う (đến thăm nhà người)",
      "いらっしゃる",
      "行く"
    ]
  },
  {
    "id": "GRAMMAR-0093",
    "stt": 93,
    "category": "KINH_NGU",
    "pattern": "うかがう",
    "meaning": "聞く / 行く / 訪ねる: Hỏi, đến thăm (khiêm nhường)",
    "exampleJa": "明日会社にうかがいます。",
    "exampleVi": "Ngày mai tôi sẽ đến công ty.",
    "freq": 2,
    "context": "Khiêm nhường: đến thăm / hỏi người trên.",
    "formation": "うかがう → うかがいます / うかがった",
    "confusables": [
      "参る",
      "お聞きする",
      "聞く"
    ]
  },
  {
    "id": "GRAMMAR-0094",
    "stt": 94,
    "category": "KINH_NGU",
    "pattern": "ご覧になる",
    "meaning": "見る: Xem, nhìn (TKN)",
    "exampleJa": "社長は新聞をご覧になります。",
    "exampleVi": "Giám đốc xem báo.",
    "freq": 2,
    "context": "Tôn kính của 見る.",
    "formation": "ご覧になる → ご覧になります; ご覧ください = hãy xem",
    "confusables": [
      "拝見する (khiêm nhường)",
      "ご + N + になる"
    ]
  },
  {
    "id": "GRAMMAR-0095",
    "stt": 95,
    "category": "KINH_NGU",
    "pattern": "おVますください",
    "meaning": "Vます: Hãy làm... (lịch sự)",
    "exampleJa": "こちらにお書きください。",
    "exampleVi": "Hãy viết vào đây.",
    "freq": 2,
    "context": "Nhờ khách / người trên làm việc gì.",
    "formation": "お + Vます bỏ ます + ください",
    "confusables": [
      "Vてください",
      "ご + N + ください (ご確認ください)"
    ]
  },
  {
    "id": "GRAMMAR-0096",
    "stt": 96,
    "category": "KINH_NGU",
    "pattern": "おっしゃる",
    "meaning": "言う: Nói (TKN)",
    "exampleJa": "先生がおっしゃいました。",
    "exampleVi": "Giáo viên đã nói.",
    "freq": 2,
    "context": "Tôn kính ngữ của 言う.",
    "formation": "おっしゃる → おっしゃいます (ます bất quy tắc)",
    "confusables": [
      "申す / 申し上げる (khiêm nhường)"
    ]
  },
  {
    "id": "GRAMMAR-0097",
    "stt": 97,
    "category": "KINH_NGU",
    "pattern": "なさる（する）",
    "meaning": "する:Làm (TKN)",
    "exampleJa": "部長は何をなさいますか。",
    "exampleVi": "Trưởng phòng làm gì?",
    "freq": 2,
    "context": "Tôn kính ngữ của する.",
    "formation": "なさる → なさいます (ます bất quy tắc)",
    "confusables": [
      "いたす (khiêm nhường)",
      "される"
    ]
  },
  {
    "id": "GRAMMAR-0098",
    "stt": 98,
    "category": "KINH_NGU",
    "pattern": "拝見する",
    "meaning": "見る: Xem (khiêm nhường)",
    "exampleJa": "書類を拝見します。",
    "exampleVi": "Tôi xem tài liệu.",
    "freq": 2,
    "context": "Khiêm nhường khi xem vật của người trên.",
    "formation": "拝見する → 拝見します",
    "confusables": [
      "ご覧になる (tôn kính)"
    ]
  },
  {
    "id": "GRAMMAR-0099",
    "stt": 99,
    "category": "KINH_NGU",
    "pattern": "おVますする",
    "meaning": "Vます: Làm gì đó (khiêm nhường)",
    "exampleJa": "私がお手伝いします。",
    "exampleVi": "Tôi sẽ giúp.",
    "freq": 2,
    "context": "Người nói làm gì đó giúp / cho người trên.",
    "formation": "お + Vます bỏ ます + する / いたす",
    "confusables": [
      "お～になる (tôn kính)",
      "ご + N + する"
    ]
  },
  {
    "id": "GRAMMAR-0100",
    "stt": 100,
    "category": "KINH_NGU",
    "pattern": "召し上がる",
    "meaning": "食べる / 飲む: Ăn / uống (tôn trọng)",
    "exampleJa": "社長はお茶を召し上がります。",
    "exampleVi": "Giám đốc uống trà.",
    "freq": 2,
    "context": "Tôn kính ngữ của 食べる / 飲む.",
    "formation": "召し上がる → 召し上がります",
    "confusables": [
      "いただく (khiêm nhường)",
      "食べる"
    ]
  },
  {
    "id": "GRAMMAR-0101",
    "stt": 101,
    "category": "KINH_NGU",
    "pattern": "さしあげる",
    "meaning": "あげる: Cho, biếu (khiêm nhường)",
    "exampleJa": "先生に本をさしあげました。",
    "exampleVi": "Tôi đã tặng sách cho thầy.",
    "freq": 1,
    "context": "Khiêm nhường: mình cho người trên.",
    "formation": "さしあげる → さしあげます",
    "confusables": [
      "くださる",
      "あげる"
    ]
  },
  {
    "id": "GRAMMAR-0102",
    "stt": 102,
    "category": "KINH_NGU",
    "pattern": "お目にかかる",
    "meaning": "会う: Gặp (khiêm nhường)",
    "exampleJa": "来週先生にお目にかかります。",
    "exampleVi": "Tuần sau tôi sẽ gặp thầy.",
    "freq": 1,
    "context": "Khiêm nhường: gặp người trên.",
    "formation": "お目にかかる → お目にかかります",
    "confusables": [
      "お会いする",
      "会う"
    ]
  },
  {
    "id": "GRAMMAR-0103",
    "stt": 103,
    "category": "KINH_NGU",
    "pattern": "ご存じ",
    "meaning": "知る: Biết (TKN)",
    "exampleJa": "社長はこのことをご存じです。",
    "exampleVi": "Giám đốc biết chuyện này.",
    "freq": 1,
    "context": "Tôn kính ngữ của 知っている.",
    "formation": "ご存じだ / ご存じです",
    "confusables": [
      "存じる (khiêm nhường: 存じます / 存じております)"
    ]
  },
  {
    "id": "GRAMMAR-0104",
    "stt": 104,
    "category": "KINH_NGU",
    "pattern": "申す",
    "meaning": "言う: Nói (khiêm nhường)",
    "exampleJa": "私は田中と申します。",
    "exampleVi": "Tôi tên là Tanaka.",
    "freq": 1,
    "context": "Khiêm nhường: giới thiệu tên, nói với người trên.",
    "formation": "申す → 申します",
    "confusables": [
      "申し上げる",
      "おっしゃる"
    ]
  },
  {
    "id": "GRAMMAR-0105",
    "stt": 105,
    "category": "KINH_NGU",
    "pattern": "くださる",
    "meaning": "くれる: Cho tôi (TKN)",
    "exampleJa": "先生が本をくださいました。",
    "exampleVi": "Thầy đã cho tôi sách.",
    "freq": 1,
    "context": "Người trên cho mình.",
    "formation": "くださる → くださいます (ます bất quy tắc)",
    "confusables": [
      "いただく",
      "くれる",
      "やる / あげる"
    ]
  },
  {
    "id": "GRAMMAR-0106",
    "stt": 106,
    "category": "LIEN_TU",
    "pattern": "そのうえ",
    "meaning": "Hơn nữa, thêm vào đó",
    "exampleJa": "この本は面白い。そのうえ、ためになる。",
    "exampleVi": "Cuốn sách này hay, hơn nữa còn bổ ích.",
    "freq": 8,
    "context": "Liên từ: bổ sung thông tin cùng chiều.",
    "formation": "Đầu câu: そのうえ、～",
    "confusables": [
      "それに",
      "さらに",
      "しかも",
      "その上 (viết kanji)"
    ]
  },
  {
    "id": "GRAMMAR-0107",
    "stt": 107,
    "category": "LIEN_TU",
    "pattern": "ところが",
    "meaning": "Thế nhưng, nhưng mà",
    "exampleJa": "雨だと思った。ところが、晴れた。",
    "exampleVi": "Tôi nghĩ trời mưa, nhưng trời lại nắng.",
    "freq": 7,
    "context": "Liên từ: kết quả trái với dự đoán.",
    "formation": "Đầu câu: ～。ところが、～",
    "confusables": [
      "しかし (trung tính)",
      "けれども",
      "ところで (đổi chủ đề)"
    ]
  },
  {
    "id": "GRAMMAR-0108",
    "stt": 108,
    "category": "LIEN_TU",
    "pattern": "今にも",
    "meaning": "Ngay lập tức, sắp sửa",
    "exampleJa": "今にも雨が降りそうだ。",
    "exampleVi": "Trời sắp mưa ngay lập tức.",
    "freq": 3,
    "context": "Phó từ: sự việc sắp xảy ra rất gần.",
    "formation": "今にも + Vそうだ",
    "confusables": [
      "もうすぐ",
      "そろそろ",
      "いまにも～そう"
    ]
  },
  {
    "id": "GRAMMAR-0109",
    "stt": 109,
    "category": "LIEN_TU",
    "pattern": "すると",
    "meaning": "Ngay sau đó, thế là",
    "exampleJa": "ドアを開けた。すると、猫が出てきた。",
    "exampleVi": "Tôi mở cửa, thế là con mèo bước ra.",
    "freq": 3,
    "context": "Liên từ: sự việc xảy ra tiếp nối bất ngờ.",
    "formation": "Đầu câu: ～。すると、～",
    "confusables": [
      "そして",
      "そうすると",
      "それで"
    ]
  },
  {
    "id": "GRAMMAR-0110",
    "stt": 110,
    "category": "LIEN_TU",
    "pattern": "なぜなら",
    "meaning": "Bởi vì, lý do là",
    "exampleJa": "彼は来られなかった。なぜなら、病気だったからだ。",
    "exampleVi": "Anh ấy không đến được, bởi vì anh ấy ốm.",
    "freq": 3,
    "context": "Liên từ: nêu lý do sau kết luận.",
    "formation": "なぜなら + ～からだ / ためだ",
    "confusables": [
      "だって (khẩu ngữ)",
      "だから",
      "というのは"
    ]
  },
  {
    "id": "GRAMMAR-0111",
    "stt": 111,
    "category": "LIEN_TU",
    "pattern": "ちなみに",
    "meaning": "Nhân tiện, tiện thể nói thêm",
    "exampleJa": "ちなみに、彼は私の兄です。",
    "exampleVi": "Nhân tiện, anh ấy là anh trai tôi.",
    "freq": 3,
    "context": "Liên từ: bổ sung thông tin phụ.",
    "formation": "Đầu câu: ちなみに、～",
    "confusables": [
      "ところで (đổi chủ đề)",
      "それに",
      "ついでに"
    ]
  },
  {
    "id": "GRAMMAR-0112",
    "stt": 112,
    "category": "LIEN_TU",
    "pattern": "だから",
    "meaning": "Vì vậy, vì thế",
    "exampleJa": "雨が降っている。だから、出かけません。",
    "exampleVi": "Trời đang mưa, vì vậy tôi không ra ngoài.",
    "freq": 3,
    "context": "Liên từ: nêu kết quả / kết luận.",
    "formation": "Đầu câu: ～。だから、～",
    "confusables": [
      "ですから (lịch sự)",
      "それで",
      "そのため"
    ]
  },
  {
    "id": "GRAMMAR-0113",
    "stt": 113,
    "category": "LIEN_TU",
    "pattern": "そこで",
    "meaning": "Do đó, vì vậy",
    "exampleJa": "道に迷った。そこで、人に聞いた。",
    "exampleVi": "Tôi bị lạc, vì vậy đã hỏi người khác.",
    "freq": 2,
    "context": "Liên từ: từ tình huống nên có hành động tiếp theo.",
    "formation": "Đầu câu: そこで、～",
    "confusables": [
      "だから",
      "それで",
      "そこで (ở đó",
      "chỗ đó)"
    ]
  },
  {
    "id": "GRAMMAR-0114",
    "stt": 114,
    "category": "LIEN_TU",
    "pattern": "けれども・けれど",
    "meaning": "Nhưng, tuy nhiên",
    "exampleJa": "天気はいいけれども、寒い。",
    "exampleVi": "Trời đẹp nhưng lạnh.",
    "freq": 2,
    "context": "Liên từ / trợ từ nối câu đối lập.",
    "formation": "Thể thường / lịch sự + けれども (けど, けれど)",
    "confusables": [
      "が",
      "しかし",
      "のに"
    ]
  },
  {
    "id": "GRAMMAR-0115",
    "stt": 115,
    "category": "LIEN_TU",
    "pattern": "その上",
    "meaning": "Hơn nữa, thêm vào đó",
    "exampleJa": "彼は優しい。その上、頭もいい。",
    "exampleVi": "Anh ấy tốt bụng, hơn nữa còn thông minh.",
    "freq": 2,
    "context": "Liên từ: thêm điểm.",
    "formation": "Đầu câu: その上、～",
    "confusables": [
      "そのうえ",
      "それに",
      "しかも"
    ]
  },
  {
    "id": "GRAMMAR-0116",
    "stt": 116,
    "category": "LIEN_TU",
    "pattern": "ただ",
    "meaning": "Chỉ, nhưng",
    "exampleJa": "欲しいものはただ一つだ。",
    "exampleVi": "Tôi chỉ muốn một thứ thôi.",
    "freq": 2,
    "context": "Phó từ \"chỉ\" hoặc liên từ \"tuy nhiên\".",
    "formation": "ただ + N / ただ、～ (liên từ)",
    "confusables": [
      "だけ",
      "しか～ない",
      "ただし"
    ]
  },
  {
    "id": "GRAMMAR-0117",
    "stt": 117,
    "category": "LIEN_TU",
    "pattern": "つまり",
    "meaning": "Tóm lại, nghĩa là",
    "exampleJa": "彼は来られない。つまり、私たちだけで行く。",
    "exampleVi": "Anh ấy không thể đến, tóm lại là chỉ có chúng tôi đi.",
    "freq": 2,
    "context": "Liên từ: diễn đạt lại / tóm tắt.",
    "formation": "Đầu câu: つまり、～",
    "confusables": [
      "すなわち",
      "要するに",
      "したがって"
    ]
  },
  {
    "id": "GRAMMAR-0118",
    "stt": 118,
    "category": "LIEN_TU",
    "pattern": "でも",
    "meaning": "Nhưng, tuy nhiên",
    "exampleJa": "高い。でも、買いたい。",
    "exampleVi": "Đắt, nhưng tôi vẫn muốn mua.",
    "freq": 2,
    "context": "Liên từ hội thoại: đối lập.",
    "formation": "Đầu câu: でも、～",
    "confusables": [
      "しかし",
      "だけど",
      "でも (trợ từ = hay là)"
    ]
  },
  {
    "id": "GRAMMAR-0119",
    "stt": 119,
    "category": "LIEN_TU",
    "pattern": "それとも",
    "meaning": "Hay là",
    "exampleJa": "コーヒーにしますか。それとも紅茶にしますか。",
    "exampleVi": "Uống cà phê hay là trà?",
    "freq": 1,
    "context": "Liên từ: lựa chọn trong câu hỏi.",
    "formation": "A か。それとも B か",
    "confusables": [
      "または",
      "あるいは",
      "か"
    ]
  },
  {
    "id": "GRAMMAR-0120",
    "stt": 120,
    "category": "LIEN_TU",
    "pattern": "ところで",
    "meaning": "Nhân tiện, mà này",
    "exampleJa": "ところで、明日の予定は？",
    "exampleVi": "Nhân tiện, kế hoạch ngày mai là gì?",
    "freq": 1,
    "context": "Liên từ: chuyển chủ đề.",
    "formation": "Đầu câu: ところで、～",
    "confusables": [
      "ところが (trái dự đoán)",
      "ちなみに"
    ]
  },
  {
    "id": "GRAMMAR-0121",
    "stt": 121,
    "category": "LIEN_TU",
    "pattern": "それでも",
    "meaning": "Dù vậy, mặc dù vậy",
    "exampleJa": "雨が降っている。それでも出かけますか。",
    "exampleVi": "Trời đang mưa, dù vậy bạn vẫn ra ngoài à?",
    "freq": 1,
    "context": "Liên từ: kết quả bất chấp điều kiện.",
    "formation": "Đầu câu: それでも、～",
    "confusables": [
      "でも",
      "けれども",
      "それなのに"
    ]
  },
  {
    "id": "GRAMMAR-0122",
    "stt": 122,
    "category": "LIEN_TU",
    "pattern": "それに",
    "meaning": "Hơn nữa, thêm vào đó",
    "exampleJa": "このケーキは美味しい。それに安い。",
    "exampleVi": "Bánh này ngon, hơn nữa còn rẻ.",
    "freq": 1,
    "context": "Liên từ: thêm lý do / điểm.",
    "formation": "Đầu câu: それに、～",
    "confusables": [
      "そのうえ",
      "しかも",
      "さらに"
    ]
  },
  {
    "id": "GRAMMAR-0123",
    "stt": 123,
    "category": "LIEN_TU",
    "pattern": "まず",
    "meaning": "Trước hết, đầu tiên",
    "exampleJa": "まず、手を洗ってください。",
    "exampleVi": "Trước hết, hãy rửa tay.",
    "freq": 1,
    "context": "Phó từ chỉ thứ tự.",
    "formation": "まず、～ (rồi つぎに / それから)",
    "confusables": [
      "はじめに",
      "最初に",
      "まず～てから"
    ]
  },
  {
    "id": "GRAMMAR-0124",
    "stt": 124,
    "category": "LIEN_TU",
    "pattern": "それなのに",
    "meaning": "Thế mà, vậy mà",
    "exampleJa": "勉強した。それなのに、試験に落ちた。",
    "exampleVi": "Tôi đã học, vậy mà vẫn trượt kỳ thi.",
    "freq": 1,
    "context": "Liên từ: kết quả trái mong đợi, thất vọng.",
    "formation": "Đầu câu: それなのに、～",
    "confusables": [
      "それでも",
      "ところが",
      "のに"
    ]
  },
  {
    "id": "GRAMMAR-0125",
    "stt": 125,
    "category": "LIEN_TU",
    "pattern": "したがって",
    "meaning": "Do đó, vì thế",
    "exampleJa": "雨が降った。したがって、試合は中止になった。",
    "exampleVi": "Trời mưa, do đó trận đấu bị hủy.",
    "freq": 1,
    "context": "Liên từ văn viết: kết luận logic.",
    "formation": "Đầu câu: したがって、～ (N にしたがって = theo)",
    "confusables": [
      "だから",
      "よって",
      "～にしたがって"
    ]
  },
  {
    "id": "GRAMMAR-0126",
    "stt": 126,
    "category": "LIEN_TU",
    "pattern": "それなら",
    "meaning": "Nếu thế, nếu vậy",
    "exampleJa": "それなら、私も行きます。",
    "exampleVi": "Nếu thế thì tôi cũng đi.",
    "freq": 1,
    "context": "Liên từ: đưa ra quyết định sau khi nghe thông tin.",
    "formation": "Đầu câu: それなら、～",
    "confusables": [
      "では",
      "じゃあ",
      "そうしたら"
    ]
  },
  {
    "id": "GRAMMAR-0127",
    "stt": 127,
    "category": "LIEN_TU",
    "pattern": "それより",
    "meaning": "Hơn nữa, thay vì...",
    "exampleJa": "それより、大事なのは健康だ。",
    "exampleVi": "Hơn nữa, điều quan trọng là sức khỏe.",
    "freq": 1,
    "context": "Liên từ: chuyển sang việc quan trọng hơn.",
    "formation": "Đầu câu: それより、～",
    "confusables": [
      "それに",
      "～より (so với)"
    ]
  },
  {
    "id": "GRAMMAR-0128",
    "stt": 128,
    "category": "LIEN_TU",
    "pattern": "または",
    "meaning": "Hoặc là",
    "exampleJa": "電話またはメールで連絡してください。",
    "exampleVi": "Hãy liên lạc bằng điện thoại hoặc email.",
    "freq": 1,
    "context": "Liên từ: lựa chọn (văn viết).",
    "formation": "N または N",
    "confusables": [
      "あるいは",
      "もしくは",
      "それとも"
    ]
  },
  {
    "id": "GRAMMAR-0129",
    "stt": 129,
    "category": "LIEN_TU",
    "pattern": "やはり",
    "meaning": "Quả đúng là, như dự đoán",
    "exampleJa": "やはり彼は来なかった。",
    "exampleVi": "Quả đúng là anh ấy không đến.",
    "freq": 1,
    "context": "Phó từ: đúng như suy nghĩ.",
    "formation": "やはり (văn nói: やっぱり)",
    "confusables": [
      "さすが",
      "もちろん",
      "やっと"
    ]
  },
  {
    "id": "GRAMMAR-0130",
    "stt": 130,
    "category": "LIEN_TU",
    "pattern": "また",
    "meaning": "Hơn nữa, thêm vào đó",
    "exampleJa": "この本は面白い。また、ためになる。",
    "exampleVi": "Cuốn sách này hay, hơn nữa còn bổ ích.",
    "freq": 1,
    "context": "Liên từ / phó từ: thêm thông tin; hoặc \"lại\".",
    "formation": "Đầu câu: また、～",
    "confusables": [
      "そのうえ",
      "さらに",
      "また (lần nữa)"
    ]
  },
  {
    "id": "GRAMMAR-0131",
    "stt": 131,
    "category": "PHO_TU",
    "pattern": "たとえば",
    "meaning": "Ví dụ",
    "exampleJa": "たとえば、猫や犬が好きです。",
    "exampleVi": "Ví dụ, tôi thích mèo và chó.",
    "freq": 6,
    "context": "Phó từ: đưa ví dụ minh họa.",
    "formation": "たとえば、～ (Đi với ～など / ～とか)",
    "confusables": [
      "例えば",
      "たとえ～ても (dù cho)"
    ]
  },
  {
    "id": "GRAMMAR-0132",
    "stt": 132,
    "category": "PHO_TU",
    "pattern": "そういう",
    "meaning": "Như vậy, như thế",
    "exampleJa": "そういう話は聞いたことがある。",
    "exampleVi": "Tôi đã nghe câu chuyện như vậy.",
    "freq": 5,
    "context": "Liên thể từ: chỉ cái liên quan đến người nghe / vừa nhắc.",
    "formation": "そういう + N",
    "confusables": [
      "こういう (gần người nói)",
      "ああいう (xa cả hai)",
      "そんな"
    ]
  },
  {
    "id": "GRAMMAR-0133",
    "stt": 133,
    "category": "PHO_TU",
    "pattern": "いつの間にか",
    "meaning": "Không biết từ lúc nào, từ bao giờ",
    "exampleJa": "いつの間にか夜になっていた。",
    "exampleVi": "Không biết từ lúc nào trời đã tối.",
    "freq": 3,
    "context": "Thay đổi diễn ra mà không nhận ra.",
    "formation": "いつの間にか + Vていた / Vた",
    "confusables": [
      "いつのまにか",
      "いつも",
      "いつか (một lúc nào đó)"
    ]
  },
  {
    "id": "GRAMMAR-0134",
    "stt": 134,
    "category": "PHO_TU",
    "pattern": "必ず",
    "meaning": "Nhất định, chắc chắn",
    "exampleJa": "毎日必ず勉強します。",
    "exampleVi": "Tôi nhất định học mỗi ngày.",
    "freq": 3,
    "context": "Phó từ: chắc chắn / luôn luôn.",
    "formation": "必ず + V",
    "confusables": [
      "きっと (suy đoán chắc)",
      "絶対",
      "必ずしも～ない (chưa chắc)"
    ]
  },
  {
    "id": "GRAMMAR-0135",
    "stt": 135,
    "category": "PHO_TU",
    "pattern": "ついに",
    "meaning": "Cuối cùng",
    "exampleJa": "ついに試験が終わった。",
    "exampleVi": "Cuối cùng kỳ thi cũng kết thúc.",
    "freq": 3,
    "context": "Sau thời gian dài mong chờ mới xảy ra.",
    "formation": "ついに + Vた",
    "confusables": [
      "とうとう",
      "やっと",
      "ようやく",
      "結局"
    ]
  },
  {
    "id": "GRAMMAR-0136",
    "stt": 136,
    "category": "PHO_TU",
    "pattern": "どうしても",
    "meaning": "Dù thế nào cũng, nhất định",
    "exampleJa": "どうしても行きたい。",
    "exampleVi": "Dù thế nào tôi cũng muốn đi.",
    "freq": 3,
    "context": "Ý chí mạnh (khẳng định), hoặc không thể làm (đi với phủ định).",
    "formation": "どうしても + Vたい / Vない",
    "confusables": [
      "なんとしても",
      "ぜひ",
      "どうか"
    ]
  },
  {
    "id": "GRAMMAR-0137",
    "stt": 137,
    "category": "PHO_TU",
    "pattern": "たしかに",
    "meaning": "Chắc chắn, đúng là",
    "exampleJa": "たしかに、彼は優しい。",
    "exampleVi": "Đúng là anh ấy tốt bụng.",
    "freq": 3,
    "context": "Công nhận một điều (thường theo sau là 'nhưng').",
    "formation": "たしかに～が / けど",
    "confusables": [
      "確実に",
      "きっと",
      "本当に"
    ]
  },
  {
    "id": "GRAMMAR-0138",
    "stt": 138,
    "category": "PHO_TU",
    "pattern": "だんだん",
    "meaning": "Dần dần",
    "exampleJa": "天気はだんだん良くなってきた。",
    "exampleVi": "Thời tiết dần dần trở nên tốt hơn.",
    "freq": 3,
    "context": "Thay đổi từ từ.",
    "formation": "だんだん + Vてくる / Aくなる",
    "confusables": [
      "次第に (văn viết)",
      "どんどん (nhanh)",
      "ますます"
    ]
  },
  {
    "id": "GRAMMAR-0139",
    "stt": 139,
    "category": "PHO_TU",
    "pattern": "つもり",
    "meaning": "Dự định, định",
    "exampleJa": "明日買い物に行くつもりです。",
    "exampleVi": "Tôi định đi mua sắm ngày mai.",
    "freq": 3,
    "context": "Ý định (đã trình bày ở ngữ pháp 61).",
    "formation": "Vる / Vない + つもり",
    "confusables": [
      "予定",
      "ようと思う",
      "ことにする"
    ]
  },
  {
    "id": "GRAMMAR-0140",
    "stt": 140,
    "category": "PHO_TU",
    "pattern": "つい",
    "meaning": "Vô tình, lỡ",
    "exampleJa": "つい食べすぎてしまった。",
    "exampleVi": "Vô tình tôi ăn quá nhiều.",
    "freq": 3,
    "context": "Lỡ làm điều không nên (thường đi với てしまう).",
    "formation": "つい + Vてしまった",
    "confusables": [
      "うっかり (sơ ý)",
      "思わず (bật ra)",
      "つい～ (ngay lúc đó)"
    ]
  },
  {
    "id": "GRAMMAR-0141",
    "stt": 141,
    "category": "PHO_TU",
    "pattern": "非常に",
    "meaning": "Rất, cực kỳ",
    "exampleJa": "この映画は非常に面白い。",
    "exampleVi": "Bộ phim này rất thú vị.",
    "freq": 3,
    "context": "Phó từ trang trọng chỉ mức độ cao.",
    "formation": "非常に + A / V",
    "confusables": [
      "とても",
      "すごく",
      "かなり"
    ]
  },
  {
    "id": "GRAMMAR-0142",
    "stt": 142,
    "category": "PHO_TU",
    "pattern": "決して",
    "meaning": "Không bao giờ (dùng với phủ định)",
    "exampleJa": "決して諦めない。",
    "exampleVi": "Tôi sẽ không bao giờ từ bỏ.",
    "freq": 3,
    "context": "Phủ định mạnh / quyết tâm.",
    "formation": "決して + Vない",
    "confusables": [
      "けっして",
      "絶対に～ない",
      "全然～ない"
    ]
  },
  {
    "id": "GRAMMAR-0143",
    "stt": 143,
    "category": "PHO_TU",
    "pattern": "せっかく",
    "meaning": "Mất công, đã...",
    "exampleJa": "せっかく来たのに、誰もいなかった。",
    "exampleVi": "Mất công đến, thế mà không có ai cả.",
    "freq": 3,
    "context": "Công sức bỏ ra quý giá nhưng kết quả thất vọng hoặc cần tận dụng.",
    "formation": "せっかく + Vた + のに / から",
    "confusables": [
      "せっかく～から (đề nghị)",
      "わざわざ (có chủ ý)"
    ]
  },
  {
    "id": "GRAMMAR-0144",
    "stt": 144,
    "category": "PHO_TU",
    "pattern": "こんなに",
    "meaning": "Như thế này, đến mức này",
    "exampleJa": "こんなに寒いとは思わなかった。",
    "exampleVi": "Tôi không nghĩ trời lạnh đến mức này.",
    "freq": 2,
    "context": "Mức độ ở gần người nói.",
    "formation": "こんなに + A / V",
    "confusables": [
      "そんなに",
      "あんなに",
      "どんなに"
    ]
  },
  {
    "id": "GRAMMAR-0145",
    "stt": 145,
    "category": "PHO_TU",
    "pattern": "あんなに",
    "meaning": "Như thế kia, đến mức kia",
    "exampleJa": "あんなに遠いとは知らなかった。",
    "exampleVi": "Tôi không biết xa đến vậy.",
    "freq": 2,
    "context": "Mức độ ở xa người nói / chuyện đã qua.",
    "formation": "あんなに + A / V",
    "confusables": [
      "そんなに",
      "こんなに",
      "あんな"
    ]
  },
  {
    "id": "GRAMMAR-0146",
    "stt": 146,
    "category": "PHO_TU",
    "pattern": "次第に",
    "meaning": "Dần dần, từ từ",
    "exampleJa": "次第に雨が強くなった。",
    "exampleVi": "Mưa dần dần trở nên to hơn.",
    "freq": 2,
    "context": "Văn viết: thay đổi từ từ.",
    "formation": "次第に + Vてきた / Aくなる",
    "confusables": [
      "だんだん (thường dùng)",
      "しだいに",
      "次第だ (tùy theo)"
    ]
  },
  {
    "id": "GRAMMAR-0147",
    "stt": 147,
    "category": "PHO_TU",
    "pattern": "ようやく",
    "meaning": "Cuối cùng, rốt cuộc",
    "exampleJa": "ようやく試験が終わった。",
    "exampleVi": "Cuối cùng kỳ thi cũng kết thúc.",
    "freq": 2,
    "context": "Đạt được sau nhiều vất vả / chờ đợi.",
    "formation": "ようやく + Vた",
    "confusables": [
      "やっと",
      "ついに",
      "とうとう"
    ]
  },
  {
    "id": "GRAMMAR-0148",
    "stt": 148,
    "category": "PHO_TU",
    "pattern": "ちっとも",
    "meaning": "Một chút cũng không",
    "exampleJa": "この本はちっとも面白くない。",
    "exampleVi": "Cuốn sách này một chút cũng không thú vị.",
    "freq": 2,
    "context": "Phủ định hoàn toàn (hội thoại).",
    "formation": "ちっとも + Vない / Aくない",
    "confusables": [
      "少しも",
      "全然",
      "まったく～ない"
    ]
  },
  {
    "id": "GRAMMAR-0149",
    "stt": 149,
    "category": "PHO_TU",
    "pattern": "そろそろ",
    "meaning": "Sắp, chuẩn bị",
    "exampleJa": "そろそろ出かけましょう。",
    "exampleVi": "Sắp đến lúc đi rồi, chúng ta chuẩn bị đi thôi.",
    "freq": 2,
    "context": "Gần đến thời điểm làm việc gì.",
    "formation": "そろそろ + Vよう / Vます",
    "confusables": [
      "もうすぐ",
      "今にも",
      "そのうち"
    ]
  },
  {
    "id": "GRAMMAR-0150",
    "stt": 150,
    "category": "PHO_TU",
    "pattern": "やっと",
    "meaning": "Cuối cùng, rốt cuộc",
    "exampleJa": "やっと仕事が終わった。",
    "exampleVi": "Cuối cùng công việc cũng xong.",
    "freq": 2,
    "context": "Hoàn thành sau nhiều khó khăn (hội thoại).",
    "formation": "やっと + Vた",
    "confusables": [
      "ようやく",
      "ついに",
      "とうとう"
    ]
  },
  {
    "id": "GRAMMAR-0151",
    "stt": 151,
    "category": "PHO_TU",
    "pattern": "全く",
    "meaning": "Hoàn toàn, thật sự",
    "exampleJa": "この話は全く分からない。",
    "exampleVi": "Tôi hoàn toàn không hiểu câu chuyện này.",
    "freq": 2,
    "context": "Phủ định hoàn toàn / nhấn mạnh.",
    "formation": "全く + Vない; 全く + A",
    "confusables": [
      "全然",
      "まるで",
      "少しも"
    ]
  },
  {
    "id": "GRAMMAR-0152",
    "stt": 152,
    "category": "PHO_TU",
    "pattern": "必ずしも",
    "meaning": "Chưa hẳn, không nhất thiết",
    "exampleJa": "必ずしも成功するとは限らない。",
    "exampleVi": "Không nhất thiết là sẽ thành công.",
    "freq": 2,
    "context": "Phủ định một phần; hay đi với とは限らない.",
    "formation": "必ずしも + Vない / とは限らない",
    "confusables": [
      "必ず",
      "かならずしも",
      "全部～ない"
    ]
  },
  {
    "id": "GRAMMAR-0153",
    "stt": 153,
    "category": "PHO_TU",
    "pattern": "きっと",
    "meaning": "Chắc chắn, nhất định",
    "exampleJa": "きっと彼は来るだろう。",
    "exampleVi": "Chắc chắn anh ấy sẽ đến.",
    "freq": 2,
    "context": "Suy đoán chắc chắn / quyết tâm.",
    "formation": "きっと + Vだろう / Vでしょう / Vはず",
    "confusables": [
      "必ず",
      "絶対",
      "たぶん (kém chắc)"
    ]
  },
  {
    "id": "GRAMMAR-0154",
    "stt": 154,
    "category": "PHO_TU",
    "pattern": "結局",
    "meaning": "Cuối cùng",
    "exampleJa": "結局、雨で試合は中止になった。",
    "exampleVi": "Cuối cùng, trận đấu bị hủy vì mưa.",
    "freq": 2,
    "context": "Kết cục sau quá trình.",
    "formation": "結局 + Vた",
    "confusables": [
      "ついに",
      "最後に",
      "結果的に"
    ]
  },
  {
    "id": "GRAMMAR-0155",
    "stt": 155,
    "category": "PHO_TU",
    "pattern": "どうか",
    "meaning": "Làm ơn, xin...",
    "exampleJa": "どうか助けてください。",
    "exampleVi": "Xin hãy giúp tôi.",
    "freq": 2,
    "context": "Lời nhờ vả / cầu xin khẩn thiết.",
    "formation": "どうか + Vてください / Vますように",
    "confusables": [
      "どうぞ",
      "ぜひ",
      "どうして"
    ]
  },
  {
    "id": "GRAMMAR-0156",
    "stt": 156,
    "category": "PHO_TU",
    "pattern": "いまにも",
    "meaning": "Sắp sửa, ngay bây giờ",
    "exampleJa": "いまにも雨が降りそうだ。",
    "exampleVi": "Trời sắp mưa ngay bây giờ.",
    "freq": 2,
    "context": "Sắp xảy ra ngay (như mục 108).",
    "formation": "いまにも + Vそうだ",
    "confusables": [
      "今にも (kanji)",
      "もうすぐ"
    ]
  },
  {
    "id": "GRAMMAR-0157",
    "stt": 157,
    "category": "PHO_TU",
    "pattern": "こういう",
    "meaning": "Như thế này",
    "exampleJa": "こういう本は面白い。",
    "exampleVi": "Những cuốn sách như thế này thật thú vị.",
    "freq": 1,
    "context": "Liên thể từ: chỉ cái gần người nói.",
    "formation": "こういう + N",
    "confusables": [
      "そういう",
      "ああいう",
      "こんな"
    ]
  },
  {
    "id": "GRAMMAR-0158",
    "stt": 158,
    "category": "PHO_TU",
    "pattern": "もちろん",
    "meaning": "Tất nhiên",
    "exampleJa": "もちろん行きます。",
    "exampleVi": "Tất nhiên tôi sẽ đi.",
    "freq": 1,
    "context": "Phó từ: khẳng định hiển nhiên.",
    "formation": "もちろん + V",
    "confusables": [
      "当然",
      "絶対",
      "もちろん～ですとも"
    ]
  },
  {
    "id": "GRAMMAR-0159",
    "stt": 159,
    "category": "PHO_TU",
    "pattern": "ああ",
    "meaning": "À, ôi",
    "exampleJa": "ああ、疲れた。",
    "exampleVi": "Ôi, mệt quá.",
    "freq": 1,
    "context": "Thán từ cảm thán (hoặc \"như thế kia\" ああ言う).",
    "formation": "ああ、～",
    "confusables": [
      "ああいう",
      "あんな",
      "ええ"
    ]
  },
  {
    "id": "GRAMMAR-0160",
    "stt": 160,
    "category": "PHO_TU",
    "pattern": "少しも",
    "meaning": "Một chút cũng không",
    "exampleJa": "少しも困っていません。",
    "exampleVi": "Tôi một chút cũng không gặp khó khăn.",
    "freq": 1,
    "context": "Phủ định hoàn toàn.",
    "formation": "少しも + Vない / Aくない",
    "confusables": [
      "ちっとも",
      "全然",
      "少し (một chút)"
    ]
  },
  {
    "id": "GRAMMAR-0161",
    "stt": 161,
    "category": "PHO_TU",
    "pattern": "そう",
    "meaning": "Như thế, đúng vậy",
    "exampleJa": "そうですか。",
    "exampleVi": "Vậy à.",
    "freq": 1,
    "context": "Đáp lại / đồng ý / chỉ thị.",
    "formation": "そう + です / だ",
    "confusables": [
      "そうだ (nghe nói / có vẻ)",
      "そう言う",
      "こう / ああ"
    ]
  },
  {
    "id": "GRAMMAR-0162",
    "stt": 162,
    "category": "PHO_TU",
    "pattern": "あまりにも",
    "meaning": "Quá, quá mức",
    "exampleJa": "あまりにも暑い。",
    "exampleVi": "Quá nóng.",
    "freq": 1,
    "context": "Mức độ vượt quá chấp nhận (tiêu cực).",
    "formation": "あまりにも + A / V",
    "confusables": [
      "とても",
      "あまり～ない",
      "すぎる"
    ]
  },
  {
    "id": "GRAMMAR-0163",
    "stt": 163,
    "category": "PHO_TU",
    "pattern": "とうとう",
    "meaning": "Cuối cùng, rốt cuộc",
    "exampleJa": "とうとう試験が終わった。",
    "exampleVi": "Cuối cùng kỳ thi cũng kết thúc.",
    "freq": 1,
    "context": "Sau thời gian dài / dồn tích.",
    "formation": "とうとう + Vた",
    "confusables": [
      "ついに",
      "ようやく",
      "やっと"
    ]
  },
  {
    "id": "GRAMMAR-0164",
    "stt": 164,
    "category": "PHO_TU",
    "pattern": "どんなに",
    "meaning": "Dù thế nào, biết bao",
    "exampleJa": "どんなに頑張っても無駄だ。",
    "exampleVi": "Dù cố gắng thế nào cũng vô ích.",
    "freq": 1,
    "context": "Mức độ cao; thường đi với ～ても / ～ことか.",
    "formation": "どんなに + V ても",
    "confusables": [
      "いくら～ても",
      "どれだけ",
      "どんな"
    ]
  },
  {
    "id": "GRAMMAR-0165",
    "stt": 165,
    "category": "PHO_TU",
    "pattern": "どちらも",
    "meaning": "Cả hai, đều",
    "exampleJa": "二人ともどちらも正しい。",
    "exampleVi": "Cả hai đều đúng.",
    "freq": 1,
    "context": "Chỉ cả hai phía.",
    "formation": "どちらも + V",
    "confusables": [
      "どちらか (một trong hai)",
      "両方",
      "二人とも"
    ]
  },
  {
    "id": "GRAMMAR-0166",
    "stt": 166,
    "category": "PHO_TU",
    "pattern": "絶対に",
    "meaning": "Tuyệt đối, chắc chắn",
    "exampleJa": "絶対に負けない。",
    "exampleVi": "Tuyệt đối không thua.",
    "freq": 1,
    "context": "Quyết tâm / khẳng định mạnh.",
    "formation": "絶対に + Vない / V",
    "confusables": [
      "必ず",
      "決して",
      "きっと"
    ]
  },
  {
    "id": "GRAMMAR-0167",
    "stt": 167,
    "category": "PHO_TU",
    "pattern": "こう",
    "meaning": "Như thế này",
    "exampleJa": "こうすればうまくいく。",
    "exampleVi": "Nếu làm như thế này sẽ thành công.",
    "freq": 1,
    "context": "Chỉ cách làm gần người nói.",
    "formation": "こう + V",
    "confusables": [
      "そう",
      "ああ",
      "こんな"
    ]
  },
  {
    "id": "GRAMMAR-0168",
    "stt": 168,
    "category": "PHO_TU",
    "pattern": "絶対",
    "meaning": "Tuyệt đối",
    "exampleJa": "絶対行く。",
    "exampleVi": "Tuyệt đối sẽ đi.",
    "freq": 1,
    "context": "Hội thoại: khẳng định mạnh.",
    "formation": "絶対 + V",
    "confusables": [
      "絶対に",
      "必ず",
      "きっと"
    ]
  },
  {
    "id": "GRAMMAR-0169",
    "stt": 169,
    "category": "PHO_TU",
    "pattern": "あまりに",
    "meaning": "Quá mức, quá",
    "exampleJa": "あまりに疲れて寝た。",
    "exampleVi": "Quá mệt nên đã ngủ.",
    "freq": 1,
    "context": "Lý do vượt mức nên dẫn đến kết quả.",
    "formation": "あまりに + A / V + て",
    "confusables": [
      "あまりにも",
      "とても",
      "～すぎる"
    ]
  },
  {
    "id": "GRAMMAR-0170",
    "stt": 170,
    "category": "PHO_TU",
    "pattern": "まだ",
    "meaning": "Vẫn, còn",
    "exampleJa": "まだ終わっていない。",
    "exampleVi": "Vẫn chưa xong.",
    "freq": 1,
    "context": "Trạng thái chưa thay đổi.",
    "formation": "まだ + Vていない / Vている",
    "confusables": [
      "もう (đã)",
      "まだまだ",
      "すでに"
    ]
  },
  {
    "id": "GRAMMAR-0171",
    "stt": 171,
    "category": "PHO_TU",
    "pattern": "けっして",
    "meaning": "Không bao giờ",
    "exampleJa": "けっして諦めない。",
    "exampleVi": "Không bao giờ từ bỏ.",
    "freq": 1,
    "context": "Phủ định mạnh.",
    "formation": "けっして + Vない",
    "confusables": [
      "決して",
      "絶対に",
      "全然"
    ]
  },
  {
    "id": "GRAMMAR-0172",
    "stt": 172,
    "category": "PHO_TU",
    "pattern": "もしかしたら",
    "meaning": "Có lẽ, có khả năng",
    "exampleJa": "もしかしたら彼は来ないかもしれない。",
    "exampleVi": "Có lẽ anh ấy sẽ không đến.",
    "freq": 1,
    "context": "Khả năng thấp, đi với かもしれない.",
    "formation": "もしかしたら + ～かもしれない",
    "confusables": [
      "もしかして",
      "たぶん",
      "きっと"
    ]
  },
  {
    "id": "GRAMMAR-0173",
    "stt": 173,
    "category": "PHO_TU",
    "pattern": "もっと",
    "meaning": "Hơn nữa, thêm",
    "exampleJa": "もっと勉強しなければならない。",
    "exampleVi": "Phải học nhiều hơn nữa.",
    "freq": 1,
    "context": "Mức độ cao hơn.",
    "formation": "もっと + V / A",
    "confusables": [
      "もう少し",
      "さらに",
      "ずっと"
    ]
  },
  {
    "id": "GRAMMAR-0174",
    "stt": 174,
    "category": "PHO_TU",
    "pattern": "ずっと",
    "meaning": "Suốt, luôn, liên tục",
    "exampleJa": "昨日からずっと雨が降っている。",
    "exampleVi": "Mưa liên tục từ hôm qua đến giờ.",
    "freq": 1,
    "context": "Liên tục suốt thời gian, hoặc \"hơn nhiều\".",
    "formation": "ずっと + Vている / A",
    "confusables": [
      "いつも",
      "ずっと (hơn hẳn)",
      "もっと"
    ]
  },
  {
    "id": "GRAMMAR-0175",
    "stt": 175,
    "category": "PHO_TU",
    "pattern": "すっかり",
    "meaning": "Hoàn toàn, hết sạch",
    "exampleJa": "宿題をすっかり忘れた。",
    "exampleVi": "Tôi hoàn toàn quên bài tập.",
    "freq": 1,
    "context": "Hoàn toàn thay đổi / hoàn thành.",
    "formation": "すっかり + Vた / Vてしまう",
    "confusables": [
      "全部",
      "まったく",
      "完全に"
    ]
  },
  {
    "id": "GRAMMAR-0176",
    "stt": 176,
    "category": "PHO_TU",
    "pattern": "ほかに",
    "meaning": "Ngoài ra, khác",
    "exampleJa": "ほかに質問はありますか。",
    "exampleVi": "Ngoài ra có câu hỏi nào không?",
    "freq": 1,
    "context": "Hỏi / nêu thêm điều khác.",
    "formation": "ほかに + V / N",
    "confusables": [
      "そのほか",
      "ほか(の)",
      "ほかには"
    ]
  },
  {
    "id": "GRAMMAR-0177",
    "stt": 177,
    "category": "PHO_TU",
    "pattern": "それほど",
    "meaning": "Không... đến mức đó",
    "exampleJa": "それほど難しくない。",
    "exampleVi": "Không khó đến mức đó.",
    "freq": 1,
    "context": "Đi với phủ định: mức độ không cao.",
    "formation": "それほど + Vない / Aくない",
    "confusables": [
      "そんなに",
      "あまり",
      "全然"
    ]
  },
  {
    "id": "GRAMMAR-0178",
    "stt": 178,
    "category": "PHO_TU",
    "pattern": "別に",
    "meaning": "Không... đặc biệt, không hẳn",
    "exampleJa": "別に嫌いじゃない。",
    "exampleVi": "Không hẳn là ghét.",
    "freq": 1,
    "context": "Phủ định nhẹ, trả lời thờ ơ.",
    "formation": "別に + Vない / じゃない",
    "confusables": [
      "特に",
      "全然",
      "別 (riêng)"
    ]
  },
  {
    "id": "GRAMMAR-0179",
    "stt": 179,
    "category": "PHO_TU",
    "pattern": "できれば",
    "meaning": "Nếu có thể",
    "exampleJa": "できれば早く来てください。",
    "exampleVi": "Nếu có thể, hãy đến sớm.",
    "freq": 1,
    "context": "Nhờ vả nhẹ nhàng.",
    "formation": "できれば + Vてください / Vたい",
    "confusables": [
      "できるだけ",
      "可能なら",
      "もしできれば"
    ]
  },
  {
    "id": "GRAMMAR-0180",
    "stt": 180,
    "category": "PHO_TU",
    "pattern": "ほとんど",
    "meaning": "Hầu hết, gần như",
    "exampleJa": "ほとんどの人が賛成した。",
    "exampleVi": "Hầu hết mọi người đều tán thành.",
    "freq": 1,
    "context": "Gần như toàn bộ; đi với phủ định = hầu như không.",
    "formation": "ほとんど + N の / V; ほとんど + Vない",
    "confusables": [
      "だいたい",
      "大部分",
      "ほぼ"
    ]
  },
  {
    "id": "GRAMMAR-0181",
    "stt": 181,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～だけ",
    "meaning": "Chỉ, chỉ có",
    "exampleJa": "ケーキだけ食べた。",
    "exampleVi": "Tôi chỉ ăn bánh.",
    "freq": 9,
    "context": "Giới hạn phạm vi.",
    "formation": "N / V / A + だけ",
    "confusables": [
      "しか～ない",
      "のみ",
      "ばかり"
    ]
  },
  {
    "id": "GRAMMAR-0182",
    "stt": 182,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～なら",
    "meaning": "Nếu là, nếu...",
    "exampleJa": "行くなら私も行く。",
    "exampleVi": "Nếu bạn đi, tôi cũng đi.",
    "freq": 8,
    "context": "Điều kiện dựa trên thông tin vừa nghe.",
    "formation": "Thể thường (Na / N bỏ だ) + なら",
    "confusables": [
      "～たら",
      "～ば",
      "～と",
      "～のなら"
    ]
  },
  {
    "id": "GRAMMAR-0183",
    "stt": 183,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てしまう",
    "meaning": "Hoàn thành, lỡ làm gì, đáng tiếc",
    "exampleJa": "宿題を忘れてしまった。",
    "exampleVi": "Tôi đã lỡ quên bài tập.",
    "freq": 8,
    "context": "Hoàn tất hẳn / tiếc nuối.",
    "formation": "Vて + しまう (hội thoại: ちゃう / じゃう)",
    "confusables": [
      "～ちゃう",
      "～ておく",
      "～ている"
    ]
  },
  {
    "id": "GRAMMAR-0184",
    "stt": 184,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～しか～ない",
    "meaning": "Chỉ có...",
    "exampleJa": "このペンしかない。",
    "exampleVi": "Chỉ có cây bút này.",
    "freq": 8,
    "context": "Giới hạn với nghĩa chê ít / không đủ.",
    "formation": "N + しか + Vない",
    "confusables": [
      "～だけ (trung tính)",
      "～ばかり"
    ]
  },
  {
    "id": "GRAMMAR-0185",
    "stt": 185,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～時",
    "meaning": "Khi... / lúc...",
    "exampleJa": "子供の時、よく川で遊んだ。",
    "exampleVi": "Hồi nhỏ tôi hay chơi ở sông.",
    "freq": 1,
    "context": "Thời điểm xảy ra.",
    "formation": "Vる / Vた / Vている / Aい / Aな / N の + 時",
    "confusables": [
      "～とき (hiragana)",
      "～ころ",
      "～際に"
    ]
  },
  {
    "id": "GRAMMAR-0186",
    "stt": 186,
    "category": "N4_TRONG_DE_N3",
    "pattern": "（疑問詞）か",
    "meaning": "Không biết...",
    "exampleJa": "彼が何をするか分からない。",
    "exampleVi": "Tôi không biết anh ấy sẽ làm gì.",
    "freq": 7,
    "context": "Câu hỏi lồng trong câu.",
    "formation": "Từ hỏi + Thể thường + か",
    "confusables": [
      "～かどうか (có hay không)",
      "～と"
    ]
  },
  {
    "id": "GRAMMAR-0187",
    "stt": 187,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～そう",
    "meaning": "Trông có vẻ, dường như",
    "exampleJa": "雨が降りそうだ。",
    "exampleVi": "Trời có vẻ sắp mưa.",
    "freq": 7,
    "context": "Phán đoán dựa trên quan sát trực tiếp.",
    "formation": "Vます bỏ ます / Aい / Aな bỏ い / な + そう (いい → よさそう, ない → なさそう)",
    "confusables": [
      "～そうだ (nghe nói)",
      "～ようだ",
      "～らしい"
    ]
  },
  {
    "id": "GRAMMAR-0188",
    "stt": 188,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ことにする",
    "meaning": "Quyết định làm gì",
    "exampleJa": "来年日本へ行くことにする。",
    "exampleVi": "Tôi quyết định sang Nhật năm sau.",
    "freq": 6,
    "context": "Bản thân tự quyết định.",
    "formation": "Vる / Vない + ことにする",
    "confusables": [
      "～ことになる (tự nhiên được quyết)",
      "～つもり",
      "～ようと思う"
    ]
  },
  {
    "id": "GRAMMAR-0189",
    "stt": 189,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～すぎる",
    "meaning": "Quá mức",
    "exampleJa": "食べすぎた。",
    "exampleVi": "Ăn quá nhiều.",
    "freq": 6,
    "context": "Mức độ vượt quá chấp nhận.",
    "formation": "Vます bỏ ます / Aい bỏ い / Aな bỏ な + すぎる",
    "confusables": [
      "～すぎ (danh từ)",
      "～過ぎ",
      "～ほど",
      "～あまり"
    ]
  },
  {
    "id": "GRAMMAR-0190",
    "stt": 190,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～たばかり",
    "meaning": "Vừa mới làm gì",
    "exampleJa": "学校へ行ったばかりだ。",
    "exampleVi": "Tôi vừa mới đến trường.",
    "freq": 6,
    "context": "Hành động vừa kết thúc.",
    "formation": "Vた + ばかり",
    "confusables": [
      "～たところ (cảm giác thời điểm ngay)",
      "～ばかり (chỉ toàn)",
      "～ている"
    ]
  },
  {
    "id": "GRAMMAR-0191",
    "stt": 191,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ておく",
    "meaning": "Làm sẵn, làm trước để tiện",
    "exampleJa": "宿題を先にやっておく。",
    "exampleVi": "Làm trước bài tập.",
    "freq": 5,
    "context": "Chuẩn bị trước / để nguyên trạng thái.",
    "formation": "Vて + おく (hội thoại: とく / どく)",
    "confusables": [
      "～てある",
      "～てしまう",
      "～とく"
    ]
  },
  {
    "id": "GRAMMAR-0192",
    "stt": 192,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ため",
    "meaning": "Vì, để",
    "exampleJa": "健康のために運動する。",
    "exampleVi": "Tập thể dục vì sức khỏe.",
    "freq": 5,
    "context": "Mục đích hoặc nguyên nhân.",
    "formation": "Vる / N の + ため(に); Vた / Aい / N の + ため(原因)",
    "confusables": [
      "～ように (mục đích không ý chí)",
      "～から",
      "～ので"
    ]
  },
  {
    "id": "GRAMMAR-0193",
    "stt": 193,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～かどうか",
    "meaning": "Có hay không",
    "exampleJa": "彼が来るかどうか分からない。",
    "exampleVi": "Không biết anh ấy có đến không.",
    "freq": 5,
    "context": "Câu hỏi Yes/No lồng.",
    "formation": "Thể thường (Na / N bỏ だ) + かどうか",
    "confusables": [
      "～か (có từ hỏi)",
      "～かもしれない",
      "～と"
    ]
  },
  {
    "id": "GRAMMAR-0194",
    "stt": 194,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ように（目的）",
    "meaning": "Để, nhằm mục đích",
    "exampleJa": "忘れないようにメモする。",
    "exampleVi": "Ghi chú để không quên.",
    "freq": 4,
    "context": "Mục đích khi vế sau là hành động có ý chí.",
    "formation": "Vる / Vない / Vられる + ように",
    "confusables": [
      "～ために (có ý chí cùng chủ thể)",
      "～ようにする",
      "～ように言う"
    ]
  },
  {
    "id": "GRAMMAR-0195",
    "stt": 195,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～かもしれません",
    "meaning": "Có thể, có lẽ",
    "exampleJa": "明日は雨が降るかもしれません。",
    "exampleVi": "Ngày mai có thể sẽ mưa.",
    "freq": 4,
    "context": "Khả năng khoảng 50%.",
    "formation": "Thể thường (Na / N bỏ だ) + かもしれない",
    "confusables": [
      "～だろう",
      "～に違いない",
      "～はず"
    ]
  },
  {
    "id": "GRAMMAR-0196",
    "stt": 196,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～たら",
    "meaning": "Nếu, khi",
    "exampleJa": "雨が降ったら、行かない。",
    "exampleVi": "Nếu trời mưa, tôi sẽ không đi.",
    "freq": 4,
    "context": "Điều kiện / giả định; \"khi... thì\".",
    "formation": "Vた / Aかった / Aだった / Nだった + ら",
    "confusables": [
      "～ば",
      "～と",
      "～なら"
    ]
  },
  {
    "id": "GRAMMAR-0197",
    "stt": 197,
    "category": "N4_TRONG_DE_N3",
    "pattern": "Vるようにする",
    "meaning": "Cố gắng làm gì, thay đổi thói quen",
    "exampleJa": "毎日運動するようにしている。",
    "exampleVi": "Tôi cố gắng tập thể dục mỗi ngày.",
    "freq": 4,
    "context": "Nỗ lực làm thành thói quen.",
    "formation": "Vる / Vない + ようにする / ようにしている",
    "confusables": [
      "～ことにする",
      "～ようになる",
      "～ように"
    ]
  },
  {
    "id": "GRAMMAR-0198",
    "stt": 198,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てみる",
    "meaning": "Thử làm gì",
    "exampleJa": "新しい料理を作ってみる。",
    "exampleVi": "Thử nấu món ăn mới.",
    "freq": 4,
    "context": "Làm thử xem kết quả.",
    "formation": "Vて + みる",
    "confusables": [
      "～てみせる (cho xem)",
      "～ようとする",
      "～てみたい"
    ]
  },
  {
    "id": "GRAMMAR-0199",
    "stt": 199,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ているところ",
    "meaning": "Đang làm gì",
    "exampleJa": "今、宿題をしているところです。",
    "exampleVi": "Bây giờ tôi đang làm bài tập.",
    "freq": 4,
    "context": "Nhấn mạnh thời điểm đang diễn ra.",
    "formation": "Vている + ところ",
    "confusables": [
      "～たところ (vừa mới)",
      "～るところ (sắp)",
      "～ているところに (đúng lúc đang)"
    ]
  },
  {
    "id": "GRAMMAR-0200",
    "stt": 200,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～という",
    "meaning": "Nghĩa là, được gọi là",
    "exampleJa": "これは「さくら」という花です。",
    "exampleVi": "Đây là hoa gọi là \"Sakura\".",
    "freq": 3,
    "context": "Giới thiệu tên gọi, nội dung.",
    "formation": "N + という + N; Thể thường + という",
    "confusables": [
      "～と言う (nói rằng)",
      "～っていう (khẩu ngữ)",
      "～といえば"
    ]
  },
  {
    "id": "GRAMMAR-0201",
    "stt": 201,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～たところ",
    "meaning": "Vừa mới làm gì",
    "exampleJa": "家に帰ったところだ。",
    "exampleVi": "Tôi vừa mới về nhà.",
    "freq": 3,
    "context": "Ngay sau khi làm xong.",
    "formation": "Vた + ところ",
    "confusables": [
      "～たばかり (rộng hơn)",
      "～ているところ",
      "～るところ"
    ]
  },
  {
    "id": "GRAMMAR-0202",
    "stt": 202,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～はず",
    "meaning": "Chắc chắn, lẽ ra",
    "exampleJa": "彼は来るはずだ。",
    "exampleVi": "Anh ấy chắc chắn sẽ đến.",
    "freq": 3,
    "context": "Suy đoán có căn cứ.",
    "formation": "Thể thường (Naな, Nの) + はず",
    "confusables": [
      "～に違いない",
      "～はずがない",
      "～つもり"
    ]
  },
  {
    "id": "GRAMMAR-0203",
    "stt": 203,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～させていただけませんか",
    "meaning": "Xin phép cho tôi làm gì (lịch sự)",
    "exampleJa": "ちょっと質問させていただけませんか。",
    "exampleVi": "Tôi có thể hỏi một chút được không?",
    "freq": 3,
    "context": "Xin phép lịch sự.",
    "formation": "Vさせて (thể sai khiến thể て) + いただけませんか",
    "confusables": [
      "～てもいいですか (thông thường)",
      "～させてください",
      "～させていただきます"
    ]
  },
  {
    "id": "GRAMMAR-0204",
    "stt": 204,
    "category": "N4_TRONG_DE_N3",
    "pattern": "Vますやすい",
    "meaning": "Dễ làm gì",
    "exampleJa": "この本は読みやすい。",
    "exampleVi": "Cuốn sách này dễ đọc.",
    "freq": 4,
    "context": "Dễ làm (tính chất khách quan).",
    "formation": "Vます bỏ ます + やすい",
    "confusables": [
      "～にくい (khó)",
      "～がちだ",
      "～やすい (dễ xảy ra)"
    ]
  },
  {
    "id": "GRAMMAR-0205",
    "stt": 205,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～がする",
    "meaning": "Nghe có tiếng / có mùi",
    "exampleJa": "花のにおいがする。",
    "exampleVi": "Có mùi hoa.",
    "freq": 3,
    "context": "Cảm giác ngũ quan tự nhiên.",
    "formation": "N (におい, 音, 味, 気...) + がする",
    "confusables": [
      "～がある",
      "～を感じる",
      "～そう"
    ]
  },
  {
    "id": "GRAMMAR-0206",
    "stt": 206,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てくれる",
    "meaning": "Ai đó làm giúp cho tôi",
    "exampleJa": "友達が手伝ってくれた。",
    "exampleVi": "Bạn đã giúp tôi.",
    "freq": 3,
    "context": "Người khác làm cho mình / nhóm mình, biết ơn.",
    "formation": "Vて + くれる",
    "confusables": [
      "～てもらう",
      "～てあげる",
      "～てやる"
    ]
  },
  {
    "id": "GRAMMAR-0207",
    "stt": 207,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てもらう",
    "meaning": "Nhận được ai đó làm gì cho mình",
    "exampleJa": "先生に教えてもらった。",
    "exampleVi": "Tôi được thầy dạy.",
    "freq": 3,
    "context": "Mình nhờ / được nhận hành động.",
    "formation": "Vて + もらう",
    "confusables": [
      "～てくれる (người làm là chủ ngữ)",
      "～ていただく",
      "～られる"
    ]
  },
  {
    "id": "GRAMMAR-0208",
    "stt": 208,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～つもり",
    "meaning": "Dự định làm gì",
    "exampleJa": "明日映画を見るつもりです。",
    "exampleVi": "Tôi dự định xem phim ngày mai.",
    "freq": 3,
    "context": "Ý định cá nhân.",
    "formation": "Vる / Vない + つもり",
    "confusables": [
      "～予定",
      "～ようと思う",
      "～ことにする"
    ]
  },
  {
    "id": "GRAMMAR-0209",
    "stt": 209,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ばいい",
    "meaning": "Nên làm gì, chỉ cách làm",
    "exampleJa": "分からなければ、聞けばいい。",
    "exampleVi": "Nếu không hiểu, bạn nên hỏi.",
    "freq": 2,
    "context": "Khuyên bảo / hỏi cách làm.",
    "formation": "Vば + いい",
    "confusables": [
      "～たらいい",
      "～といい",
      "～たほうがいい"
    ]
  },
  {
    "id": "GRAMMAR-0210",
    "stt": 210,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ようになる",
    "meaning": "Trở nên có thể làm gì",
    "exampleJa": "日本語が話せるようになった。",
    "exampleVi": "Tôi đã trở nên có thể nói tiếng Nhật.",
    "freq": 2,
    "context": "Sự thay đổi trạng thái / khả năng / thói quen.",
    "formation": "Vる / Vない + ようになる",
    "confusables": [
      "～ようにする",
      "～くなる",
      "～てくる"
    ]
  },
  {
    "id": "GRAMMAR-0211",
    "stt": 211,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～までに",
    "meaning": "Trước khi, trước thời điểm",
    "exampleJa": "5時までに帰ってください。",
    "exampleVi": "Hãy về trước 5 giờ.",
    "freq": 2,
    "context": "Hạn chót của hành động một lần.",
    "formation": "N / Vる + までに",
    "confusables": [
      "～まで (liên tục đến)",
      "～前に",
      "～うちに"
    ]
  },
  {
    "id": "GRAMMAR-0212",
    "stt": 212,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～だろう",
    "meaning": "Có lẽ, chắc là",
    "exampleJa": "明日は雨だろう。",
    "exampleVi": "Ngày mai có lẽ trời mưa.",
    "freq": 2,
    "context": "Phỏng đoán.",
    "formation": "Thể thường (Na, N bỏ だ) + だろう",
    "confusables": [
      "～でしょう",
      "～かもしれない",
      "～と思う"
    ]
  },
  {
    "id": "GRAMMAR-0213",
    "stt": 213,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～るところ",
    "meaning": "Chuẩn bị làm gì, sắp làm gì",
    "exampleJa": "今から出かけるところだ。",
    "exampleVi": "Tôi chuẩn bị đi ra ngoài bây giờ.",
    "freq": 2,
    "context": "Sắp bắt đầu hành động.",
    "formation": "Vる + ところ",
    "confusables": [
      "～ているところ",
      "～たところ",
      "～ようとしている"
    ]
  },
  {
    "id": "GRAMMAR-0214",
    "stt": 214,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てもらえませんか",
    "meaning": "Nhờ ai làm gì (lịch sự)",
    "exampleJa": "この書類を見てもらえませんか。",
    "exampleVi": "Bạn có thể xem giúp tôi tài liệu này không?",
    "freq": 2,
    "context": "Nhờ vả lịch sự.",
    "formation": "Vて + もらえませんか / もらえない?",
    "confusables": [
      "～てくれませんか",
      "～てください",
      "～ていただけませんか"
    ]
  },
  {
    "id": "GRAMMAR-0215",
    "stt": 215,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てくださいませんか",
    "meaning": "Nhờ ai làm gì (rất lịch sự)",
    "exampleJa": "もう一度説明してくださいませんか。",
    "exampleVi": "Bạn có thể giải thích lại một lần nữa được không?",
    "freq": 2,
    "context": "Nhờ vả rất lịch sự.",
    "formation": "Vて + くださいませんか",
    "confusables": [
      "～ていただけませんか",
      "～てください",
      "～てくれませんか"
    ]
  },
  {
    "id": "GRAMMAR-0216",
    "stt": 216,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～場合",
    "meaning": "Trong trường hợp, nếu",
    "exampleJa": "雨の場合に、試合は中止です。",
    "exampleVi": "Trong trường hợp mưa, trận đấu bị hủy.",
    "freq": 2,
    "context": "Giả định tình huống cụ thể.",
    "formation": "Vる / Vない / Vた / Aい / Aな / N の + 場合(は)",
    "confusables": [
      "～とき",
      "～たら",
      "～ば"
    ]
  },
  {
    "id": "GRAMMAR-0217",
    "stt": 217,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～のに",
    "meaning": "Mặc dù, vậy mà",
    "exampleJa": "雨が降っているのに、出かけた。",
    "exampleVi": "Mặc dù trời mưa, tôi vẫn ra ngoài.",
    "freq": 2,
    "context": "Trái với dự đoán; trách móc / tiếc nuối.",
    "formation": "Thể thường (Naな, N な) + のに",
    "confusables": [
      "～けど",
      "～が",
      "～ても; ～のに (mục đích = để)"
    ]
  },
  {
    "id": "GRAMMAR-0218",
    "stt": 218,
    "category": "N4_TRONG_DE_N3",
    "pattern": "Vますにくい",
    "meaning": "Khó làm gì",
    "exampleJa": "この漢字は覚えにくい。",
    "exampleVi": "Chữ Hán này khó nhớ.",
    "freq": 2,
    "context": "Khó làm (tính chất khách quan).",
    "formation": "Vます bỏ ます + にくい",
    "confusables": [
      "～づらい (khó chịu)",
      "～やすい",
      "～がたい"
    ]
  },
  {
    "id": "GRAMMAR-0219",
    "stt": 219,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～途中",
    "meaning": "Đang giữa chừng làm gì",
    "exampleJa": "食事の途中で電話がかかってきた。",
    "exampleVi": "Giữa bữa ăn thì có điện thoại gọi tới.",
    "freq": 2,
    "context": "Bị gián đoạn khi đang làm.",
    "formation": "Vる / N の + 途中(で / に)",
    "confusables": [
      "～ているところ",
      "～最中",
      "～うちに"
    ]
  },
  {
    "id": "GRAMMAR-0220",
    "stt": 220,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～たらどうですか",
    "meaning": "Nên làm gì (gợi ý)",
    "exampleJa": "もっと勉強したらどうですか。",
    "exampleVi": "Bạn nên học nhiều hơn.",
    "freq": 1,
    "context": "Đề nghị / gợi ý nhẹ nhàng.",
    "formation": "Vた + らどうですか",
    "confusables": [
      "～たほうがいい",
      "～ませんか",
      "～てはどうですか"
    ]
  },
  {
    "id": "GRAMMAR-0221",
    "stt": 221,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ないほうがいい",
    "meaning": "Không nên làm gì",
    "exampleJa": "無理しないほうがいい。",
    "exampleVi": "Không nên gắng sức.",
    "freq": 1,
    "context": "Khuyên không nên làm.",
    "formation": "Vない + ほうがいい",
    "confusables": [
      "～たほうがいい",
      "～てはいけない",
      "～ないでください"
    ]
  },
  {
    "id": "GRAMMAR-0222",
    "stt": 222,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ながら～",
    "meaning": "Vừa... vừa...",
    "exampleJa": "音楽を聞きながら勉強する。",
    "exampleVi": "Vừa nghe nhạc vừa học.",
    "freq": 1,
    "context": "Hai hành động đồng thời, vế sau là chính.",
    "formation": "Vます bỏ ます + ながら",
    "confusables": [
      "～つつ (văn viết)",
      "～ながらも (tuy nhưng)",
      "～たり～たり"
    ]
  },
  {
    "id": "GRAMMAR-0223",
    "stt": 223,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～させていただきます",
    "meaning": "Tôi xin phép làm gì (lịch sự)",
    "exampleJa": "これから説明させていただきます。",
    "exampleVi": "Tôi xin phép giải thích từ bây giờ.",
    "freq": 1,
    "context": "Thông báo hành động của mình một cách khiêm tốn.",
    "formation": "Vさせて + いただきます",
    "confusables": [
      "～いたします",
      "～させてください",
      "～させていただけませんか"
    ]
  },
  {
    "id": "GRAMMAR-0224",
    "stt": 224,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～ましょうか",
    "meaning": "Để nghị, tôi có nên...?",
    "exampleJa": "手伝いましょうか。",
    "exampleVi": "Tôi giúp bạn được không?",
    "freq": 1,
    "context": "Đề nghị giúp đỡ hoặc hỏi ý kiến.",
    "formation": "Vます bỏ ます + ましょうか",
    "confusables": [
      "～ませんか (rủ rê)",
      "～ましょう (cùng làm)",
      "～ていいですか"
    ]
  },
  {
    "id": "GRAMMAR-0225",
    "stt": 225,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～んです",
    "meaning": "Giải thích lý do, nhấn mạnh",
    "exampleJa": "遅れたんです。",
    "exampleVi": "Vì tôi đến muộn.",
    "freq": 1,
    "context": "Giải thích / xin lỗi / hỏi lý do.",
    "formation": "Thể thường (Naな, N な) + んです / のです",
    "confusables": [
      "～から",
      "～ので",
      "～んですか (hỏi lý do)"
    ]
  },
  {
    "id": "GRAMMAR-0226",
    "stt": 226,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～たあとで",
    "meaning": "Sau khi làm gì",
    "exampleJa": "食べたあとで運動する。",
    "exampleVi": "Sau khi ăn, tập thể dục.",
    "freq": 1,
    "context": "Thứ tự hành động.",
    "formation": "Vた + あとで; N の + あとで",
    "confusables": [
      "～てから",
      "～まえに",
      "～あと"
    ]
  },
  {
    "id": "GRAMMAR-0227",
    "stt": 227,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～のは",
    "meaning": "Làm V thì là A",
    "exampleJa": "日本語を勉強するのは楽しい。",
    "exampleVi": "Học tiếng Nhật thì vui.",
    "freq": 1,
    "context": "Danh từ hóa động từ làm chủ đề.",
    "formation": "Vる + のは + A",
    "confusables": [
      "～ことは",
      "～の",
      "～こと"
    ]
  },
  {
    "id": "GRAMMAR-0228",
    "stt": 228,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てある",
    "meaning": "Đã được làm gì sẵn",
    "exampleJa": "窓が開けてある。",
    "exampleVi": "Cửa sổ đã được mở sẵn.",
    "freq": 1,
    "context": "Trạng thái kết quả do ai đó chủ ý làm (tha động từ).",
    "formation": "Vて (tha động từ) + ある",
    "confusables": [
      "～ている (tự động từ)",
      "～ておく",
      "～てしまう"
    ]
  },
  {
    "id": "GRAMMAR-0229",
    "stt": 229,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～てもかまわない",
    "meaning": "Không sao, không vấn đề",
    "exampleJa": "ここに座ってもかまわない。",
    "exampleVi": "Ngồi ở đây không sao.",
    "freq": 1,
    "context": "Cho phép / không phiền.",
    "formation": "Vて + もかまわない",
    "confusables": [
      "～てもいい",
      "～てもよろしい",
      "～なくてもかまわない"
    ]
  },
  {
    "id": "GRAMMAR-0230",
    "stt": 230,
    "category": "N4_TRONG_DE_N3",
    "pattern": "～前に",
    "meaning": "Trước khi làm gì",
    "exampleJa": "寝る前に歯を磨きます。",
    "exampleVi": "Đánh răng trước khi đi ngủ.",
    "freq": 1,
    "context": "Thứ tự trước-sau.",
    "formation": "Vる / N の + 前に",
    "confusables": [
      "～あとで",
      "～てから",
      "～までに"
    ]
  }
];
