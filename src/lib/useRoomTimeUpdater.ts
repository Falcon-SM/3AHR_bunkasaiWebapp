import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * roomnumに応じて、RoomNumテーブルのtimeを10秒おきに更新するカスタムフック
 * @param roomnum - ルーム番号 (1から6)
 */
export const useRoomTimeUpdater = (roomnum: number | null) => {
  const startTimeRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // roomnumが1から6の範囲外、またはnullの場合は処理を中断
    if (!roomnum || roomnum < 1 || roomnum > 6) {
      // 既存のタイマーがあればクリア
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    // 解き始めた時間を記録
    startTimeRef.current = Date.now();

    // 10秒おきにSupabaseを更新するタイマーを設定
    intervalIdRef.current = setInterval(async () => {
      if (!startTimeRef.current) return;

      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      const { error } = await supabase
        .from('RoomNum')
        .update({ time: elapsedTime })
        .eq('id', roomnum);

      if (error) {
        console.error('Error updating time:', error);
      }
    }, 10000); // 10秒ごと

    // コンポーネントのアンマウント時、またはroomnum変更時にタイマーをクリア
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [roomnum]); // roomnumが変更されたらエフェクトを再実行
};