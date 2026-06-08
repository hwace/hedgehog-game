export default function Home() {
  return (
    <main className="min-h-screen bg-pink-100 p-6">
      <div className="max-w-md mx-auto">
        {/* 상단 정보 */}
        <div className="bg-white rounded-3xl p-4 shadow-xl mb-4">
          <h1 className="text-3xl font-bold text-center mb-4">
            🦔 밤톨이
          </h1>

          <div className="space-y-2 text-gray-700">
            <p>💰 코인: 500</p>
            <p>⭐ 점수: 0</p>
            <p>😊 기분: 행복함</p>
            <p>🍖 배고픔: 배부름</p>
          </div>
        </div>

        {/* 고슴도치 */}
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center mb-4">
          <div className="text-8xl mb-4">
            🦔
          </div>

          <p className="text-gray-500">
            오늘도 귀엽다...
          </p>
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-yellow-300 rounded-2xl p-4 font-bold hover:scale-105 transition">
            🍖 먹이
          </button>

          <button className="bg-pink-300 rounded-2xl p-4 font-bold hover:scale-105 transition">
            ✋ 만지기
          </button>

          <button className="bg-green-300 rounded-2xl p-4 font-bold hover:scale-105 transition">
            💩 청소
          </button>
        </div>
      </div>
    </main>
  );
}