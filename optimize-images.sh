#!/bin/bash

# 画像最適化スクリプト
# 必要なツール: ImageMagick (convert), cwebp

echo "画像最適化を開始します..."

# 画像ディレクトリ
IMAGES_DIR="images"
OUTPUT_DIR="images"

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$OUTPUT_DIR"

# サポートされている画像形式
SUPPORTED_FORMATS=("jpg" "jpeg" "png")

# 各画像形式を処理
for format in "${SUPPORTED_FORMATS[@]}"; do
    # 該当する形式の画像ファイルを検索
    find "$IMAGES_DIR" -name "*.$format" -o -name "*.$format" | while read -r image_file; do
        if [ -f "$image_file" ]; then
            # ファイル名と拡張子を取得
            filename=$(basename "$image_file")
            name_without_ext="${filename%.*}"
            
            # WebPファイルのパス
            webp_file="$OUTPUT_DIR/${name_without_ext}.webp"
            
            echo "処理中: $filename -> ${name_without_ext}.webp"
            
            # ImageMagickを使用してWebPに変換（品質を60に下げる）
            if command -v convert &> /dev/null; then
                convert "$image_file" -quality 60 "$webp_file"
                echo "✓ 変換完了: $webp_file"
            elif command -v cwebp &> /dev/null; then
                cwebp -q 60 "$image_file" -o "$webp_file"
                echo "✓ 変換完了: $webp_file"
            else
                echo "✗ エラー: ImageMagickまたはcwebpがインストールされていません"
                echo "  インストール方法:"
                echo "  - macOS: brew install imagemagick"
                echo "  - Ubuntu: sudo apt-get install imagemagick"
                echo "  - CentOS: sudo yum install ImageMagick"
                exit 1
            fi
            
            # ファイルサイズの比較
            if [ -f "$webp_file" ]; then
                original_size=$(stat -f%z "$image_file" 2>/dev/null || stat -c%s "$image_file" 2>/dev/null)
                webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
                
                if [ "$original_size" -gt 0 ] && [ "$webp_size" -gt 0 ]; then
                    savings=$((100 - (webp_size * 100 / original_size)))
                    echo "  サイズ削減: ${savings}% (${original_size} bytes -> ${webp_size} bytes)"
                fi
            fi
        fi
    done
done

echo ""
echo "画像最適化が完了しました！"
echo ""
echo "次の手順:"
echo "1. 生成されたWebPファイルが正しく表示されるか確認してください"
echo "2. 古いブラウザ向けのフォールバック画像として元の画像も残してください"
echo "3. 必要に応じて画像の品質を調整してください（-quality パラメータ）"
echo ""
echo "注意: このスクリプトは元の画像ファイルを変更しません"
