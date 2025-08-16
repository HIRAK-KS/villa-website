#!/bin/bash

# 既存画像最適化スクリプト
# 必要なツール: ImageMagick (convert)

echo "既存画像の最適化を開始します..."

# 画像ディレクトリ
IMAGES_DIR="images"
BACKUP_DIR="images/backup"

# バックアップディレクトリを作成
mkdir -p "$BACKUP_DIR"

# サポートされている画像形式
SUPPORTED_FORMATS=("jpg" "jpeg")

echo "元の画像をバックアップしています..."
# 元の画像をバックアップ
find "$IMAGES_DIR" -name "*.jpg" -o -name "*.jpeg" | while read -r image_file; do
    if [ -f "$image_file" ]; then
        filename=$(basename "$image_file")
        cp "$image_file" "$BACKUP_DIR/$filename"
    fi
done

echo "画像の最適化を実行しています..."
# 各画像形式を処理
for format in "${SUPPORTED_FORMATS[@]}"; do
    find "$IMAGES_DIR" -name "*.$format" -o -name "*.$format" | while read -r image_file; do
        if [ -f "$image_file" ]; then
            filename=$(basename "$image_file")
            name_without_ext="${filename%.*}"
            
            echo "処理中: $filename"
            
            # 一時ファイル名
            temp_file="$IMAGES_DIR/${name_without_ext}_temp.$format"
            
            # ImageMagickを使用して画像を最適化（品質85、プログレッシブJPEG）
            if command -v convert &> /dev/null; then
                convert "$image_file" -quality 85 -interlace Plane "$temp_file"
                
                # ファイルサイズの比較
                original_size=$(stat -f%z "$image_file" 2>/dev/null || stat -c%s "$image_file" 2>/dev/null)
                optimized_size=$(stat -f%z "$temp_file" 2>/dev/null || stat -c%s "$temp_file" 2>/dev/null)
                
                if [ "$original_size" -gt 0 ] && [ "$optimized_size" -gt 0 ]; then
                    if [ "$optimized_size" -lt "$original_size" ]; then
                        # 最適化されたファイルが小さい場合、置き換え
                        mv "$temp_file" "$image_file"
                        savings=$((100 - (optimized_size * 100 / original_size)))
                        echo "✓ 最適化完了: ${savings}% 削減 (${original_size} bytes -> ${optimized_size} bytes)"
                    else
                        # 最適化されない場合、一時ファイルを削除
                        rm "$temp_file"
                        echo "✓ 既に最適化済み"
                    fi
                fi
            else
                echo "✗ エラー: ImageMagickがインストールされていません"
                exit 1
            fi
        fi
    done
done

echo ""
echo "既存画像の最適化が完了しました！"
echo ""
echo "最適化結果:"
echo "- 元の画像は $BACKUP_DIR にバックアップされています"
echo "- 最適化された画像は元の場所に配置されています"
echo "- プログレッシブJPEG形式で最適化されています"
echo ""
echo "注意: このスクリプトは元の画像ファイルを最適化して置き換えます"
