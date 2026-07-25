export const TOOLTIP_COPY = {
  profileCompleteness:
    'Profil tamlığı, çiftçi bilgilerinin destek, ticari eşleştirme ve finans gibi amaçlar için ne kadar yeterli olduğunu gösterir.',
  criticalMissing:
    'Kritik eksik bilgi, operasyonel kararları doğrudan etkileyebilecek boş profil alanlarını listeler.',
  alwaysCritical:
    'Her zaman kritik: Bu alanlar doldurulmadan temel operasyonlar güvenilir ilerletilemez.',
  conditionalCritical:
    'Şartlı kritik: Belirli senaryolarda (ör. kredi ihtiyacı varken tutar) tamamlanması gereken alanlardır.',
  complementary:
    'Tamamlayıcı: Zorunlu değildir; profil zenginleştikçe öneri ve eşleştirme kalitesini artırır.',
  aiMemory:
    'AI Hafızası, konuşma, belge ve AI çıkarımlarından üretilen profil önerileridir. Çalışan onayı sonrası profile yansıtılır.',
  aiInference:
    'AI çıkarımı, görsel veya konuşmadan otomatik üretilen bir bulgudur. Teşhis veya kesin karar yerine geçmez.',
  confidence:
    'Güven skoru, modelin bu çıkarımındaki kesinliğini gösterir. Doğruluğun garantisi değildir; gerektiğinde insan incelemesi yapılmalıdır.',
  operationsCenter:
    'Operasyon Merkezi; AI incelemeleri ve tamamlanması gereken manuel görevleri tek yerde toplar.',
  aiReview:
    'AI İncelemesi, otomatik bir çıkarımın çalışan tarafından kabul, red veya düzenleme ile sonuçlandırılmasını bekler.',
  notifications:
    'Bildirimler; sigorta, AI sinyali veya yeni belge gibi anlamlı profil olaylarında oluşur.',
  timeline:
    'Zaman çizelgesi, çiftçiyle ilgili konuşma, belge, çıkarım ve profil güncellemelerini kronolojik gösterir.',
} as const

export const EMPTY_HELP_COPY = {
  aiMemory:
    'AI Hafızası; konuşmalar, belgeler veya AI çıkarımlarından otomatik oluşur. Yeni etkileşimler geldikçe burada görünür.',
  notifications:
    'Anlamlı bir profil olayı (sigorta uyarısı, AI sinyali, yeni belge) oluştuğunda bildirimler burada listelenir.',
  operations:
    'İnceleme bekleyen AI bulguları veya tamamlanması gereken manuel görevler oluştuğunda burada görünür.',
  timeline:
    'Çiftçiyle yapılan konuşmalar, yüklenen belgeler ve AI çıkarımları burada zaman sırasıyla birikir.',
  conversations:
    'WhatsApp, telefon veya saha görüşmeleri kayda geçtikçe konuşmalar burada listelenir.',
  documents:
    'ÇKS, analiz veya poliçe gibi belgeler yüklendikçe bu sekmede önizlenebilir ve indirilebilir.',
} as const
