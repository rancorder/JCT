# JCT様 プレ商談・1次商談 画面共有スライド

有限会社ジェイシーティー様｜1次商談・プレ商談用の二画面（プレゼンター／オーディエンス）スライド。
slide_spec.md / talk_script.md をもとに実装。STUDIO TRAM等と同じ BroadcastChannel 方式の
プレゼンター・オーディエンス分離構成。

## 構成

```
index.html       ← オーディエンス画面（画面共有でこちらを共有する）
presenter.html   ← プレゼンター画面（自分の画面のみで開く。台本・キュー・進行操作）
slides-data.js   ← スライド本文データ（正本）
render.js        ← オーディエンス画面のHTML生成ロジック
styles.css       ← 共通デザイントークン／オーディエンス画面レイアウト
presenter.css    ← プレゼンター画面専用レイアウト
```

## 使い方（商談当日）

1. `presenter.html` を自分のPCで開く（このウィンドウは相手に見せない）
2. `index.html` を別ウィンドウで開き、画面共有ではこのウィンドウだけを選ぶ
3. presenter.html側の「次へ／前へ」ボタン、または矢印キー／スペースキーで進行
   → index.html側は自動で同期される（BroadcastChannel使用、同一オリジン内のみ）
4. 右側パネルに台本とキュー（分岐対応）が出るので、読み上げず要点を見ながら話す

## ローカル確認方法

ES Modules（`type="module"`）を使っているため、`index.html` をダブルクリックして
`file://` で開くと動作しません（ブラウザのCORS制約）。ローカルで確認する場合は簡易サーバーを使う。

```bash
npx serve .
# または
python3 -m http.server 8000
```

## デプロイ（GitHub / Vercel）

このままリポジトリにpushし、Vercelで静的サイトとしてデプロイ可能（ビルド不要）。
商談ごとに `slides-data.js` 内、Slide 1の `meta.target`（対象企業名）と `meta.date`（日付）だけ
書き換えて使う。

## 未確定・要確認事項（正本未反映分）

Slide 5〜8の内容は、正本（Google Docs）が非公開で全文確認できなかったため、
decision_log.md に記載した仮組み。正本閲覧後、`slides-data.js` の該当スライド
（id: 5, 6, 7, 8）の `items` / `steps` / `quadrant` を正式情報に差し替えること。
現時点では未確認の数値・実績は一切含めていない。
