import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 누락'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const UPDATES = [
  // 고기구이
  { id: '3c1dd71b-f112-4fff-9db2-ab4b06a95760', subcategory: '고기구이' },
  { id: 'c5401085-d0a9-467b-a04d-7368ec1694dd', subcategory: '고기구이' },
  { id: '65e1c561-20f9-44ae-bb13-c720790007b9', subcategory: '고기구이' },
  { id: '8187d6ab-561c-4f4f-b5ae-850fd514b231', subcategory: '고기구이' },
  { id: '608660d0-19ce-44dc-ae26-c425f621361c', subcategory: '고기구이' },
  { id: '00e6ce1a-25a6-4417-8e4d-81fc25e7bfe4', subcategory: '고기구이' },
  { id: 'dc0b5e5b-1349-4c6f-b954-4b39ad9795b5', subcategory: '고기구이' },
  { id: '354e286e-8e01-43d6-8d89-27aede7e5d4e', subcategory: '고기구이' },
  { id: '3c2ca928-3bc1-4867-90f9-9ff3dcb5320b', subcategory: '고기구이' },
  { id: 'f4a0bb34-6f05-42e0-8f26-e835bedf82d1', subcategory: '고기구이' },
  { id: 'd16cb6cd-70b8-4889-896a-d2b3132f471f', subcategory: '고기구이' },
  { id: 'ac2e65c0-d6a8-411a-8b66-ea3d958f5d79', subcategory: '고기구이' },
  { id: '8852365c-42b9-458b-ad03-6d6f92902991', subcategory: '고기구이' },
  { id: 'f13aaacd-b453-45f1-8810-19574ea41bca', subcategory: '고기구이' },
  { id: '0f31807d-f34f-4bf7-8ac3-dc998262073f', subcategory: '고기구이' },
  { id: 'bff198fa-3181-4d45-b880-1f4abfee0588', subcategory: '고기구이' },
  { id: '28eb0a58-cf30-42f6-8e05-354aff380450', subcategory: '고기구이' },
  { id: '187ba8f0-0260-4307-a763-87f2104ecf30', subcategory: '고기구이' },
  { id: 'f0533b2d-f258-4656-a68f-a02999094a4d', subcategory: '고기구이' },
  { id: 'b068abee-ea8c-4b7c-bd20-3b4eb1ae6288', subcategory: '고기구이' },
  { id: '934e571f-33cb-4472-99b0-abb01a3159e0', subcategory: '고기구이' },
  { id: '77d1e802-7715-427a-be71-555c7875707b', subcategory: '고기구이' },
  { id: '04ff4638-bcc7-4d8a-af42-2490a40399af', subcategory: '고기구이' },
  { id: 'fedbac82-b066-487a-8f78-c1870a1ddd74', subcategory: '고기구이' },
  { id: 'f02673be-782e-43c2-8124-30b706150ff4', subcategory: '고기구이' },
  { id: '93b8a6c6-5297-4e67-a3fa-4dc6479c263e', subcategory: '고기구이' },
  { id: 'd3d787e4-e6f6-4840-8457-7ab39275d307', subcategory: '고기구이' },
  { id: '8f89f038-6a73-48b7-b9dc-5f21b9c5831c', subcategory: '고기구이' },
  { id: '1f31fa17-f848-4141-b70c-14e40583c7a3', subcategory: '고기구이' },
  { id: '43f96ebc-76a8-4f68-9444-a4870fbe2796', subcategory: '고기구이' },
  { id: 'c698dd46-e2da-42e7-b4a3-18cab1256554', subcategory: '고기구이' },
  { id: '6cc8054a-55a4-4ddc-9967-4e92c80d38f7', subcategory: '고기구이' },
  { id: 'd2584fd2-2289-458e-a90e-1a59ef5e62f2', subcategory: '고기구이' },
  { id: '99f19c11-6ac6-4cd5-8a50-cdff30dacf97', subcategory: '고기구이' },
  { id: '76ea6761-e808-4d35-afb1-918671736a9a', subcategory: '고기구이' },
  { id: 'ce081e3e-6d5c-411a-95a3-00a89571b948', subcategory: '고기구이' },
  // 치킨
  { id: 'b97f35c9-cd22-4cd4-9f13-eec2ee085de0', subcategory: '치킨' },
  { id: 'f9abdfec-d9aa-4914-9863-ff427bdf8ba7', subcategory: '치킨' },
  { id: 'e054b7a7-88f4-4c0e-9e26-67050dc5d87c', subcategory: '치킨' },
  { id: 'acc48802-a119-4443-b2c9-2ceeaf48961c', subcategory: '치킨' },
  { id: '1174f8f4-b2e6-4c8d-befe-3fed7eec0fc2', subcategory: '치킨' },
  { id: '1707c8fc-13e8-478e-9056-622f71b35c5d', subcategory: '치킨' },
  { id: '019acda7-12ef-43cc-b771-beee6f751a43', subcategory: '치킨' },
  { id: 'ab667b86-fbe0-41dc-9990-f11cbab2a4f9', subcategory: '치킨' },
  { id: 'b1bf5329-2101-4ae3-845c-8eb017c387d5', subcategory: '치킨' },
  { id: 'db7c821e-4636-403e-85e3-8313136f00fc', subcategory: '치킨' },
  { id: '15765554-728c-4515-ba29-75612b81a77f', subcategory: '치킨' },
  { id: '72581a75-aaf4-4ce7-acee-2f0b068df296', subcategory: '치킨' },
  { id: '303070dc-78b8-4626-9305-b09e624ede5e', subcategory: '치킨' },
  { id: '3ca743de-1666-4413-b69c-e2ad4314d7d5', subcategory: '치킨' },
  { id: '5d9671ac-ab98-460b-8761-56d38d1cbe68', subcategory: '치킨' },
  { id: '419f5a4d-01d9-4da1-b1c8-5c668f6c164d', subcategory: '치킨' },
  { id: '5de3fa0a-9717-4e24-baae-15553bb3b0f2', subcategory: '치킨' },
  { id: '871cf174-cdd6-489b-b09c-4b4905803d22', subcategory: '치킨' },
  { id: '93c73820-7fc8-48cb-86ed-0c5aac709731', subcategory: '치킨' },
  { id: 'd2c36de9-563c-421c-a17e-48284991026f', subcategory: '치킨' },
  { id: '93835a36-1688-43d2-af2d-dcd321b1d5c0', subcategory: '치킨' },
  { id: '1417ddbf-ea5d-42ed-8f91-42880226265b', subcategory: '치킨' },
  { id: 'a2f335a0-9777-438d-a459-392bc333d336', subcategory: '치킨' },
  { id: 'cff8fe07-b6a5-4d11-8b00-040a45c483b1', subcategory: '치킨' },
  { id: '1567f6a9-a07d-461e-93a1-42390e892a7f', subcategory: '치킨' },
  { id: '43ad49b8-5b15-4c94-8db7-71f8093d9f27', subcategory: '치킨' },
  { id: '34fc72cd-98cb-4731-8d2a-465a8b8e1de2', subcategory: '치킨' },
  { id: '362f03db-f91c-43d1-a249-baaa3846de34', subcategory: '치킨' },
  { id: '376bb0d3-c87c-4015-967a-e646a42d046e', subcategory: '치킨' },
  { id: '7d3fd2fe-a536-43ca-ae86-2e8bc30bc94e', subcategory: '치킨' },
  { id: '8e4fa3d2-82ee-4f70-a0de-8cbe85e6a0c4', subcategory: '치킨' },
  { id: '453e0a88-99f9-4a57-8697-14cd5e83b7fa', subcategory: '치킨' },
  { id: 'b046043e-b9f0-406b-95a2-179df3f39a5d', subcategory: '치킨' },
  // 포차/호프
  { id: '6d38bd56-73f2-44f7-b85d-4b6cc1c7c2aa', subcategory: '포차/호프' },
  { id: '7d66cadc-5689-4b53-8730-ec6f53080a85', subcategory: '포차/호프' },
  { id: 'b2b982cd-3a77-464a-a30c-ec82acf7427c', subcategory: '포차/호프' },
  { id: '63a4c8b1-74e6-41a8-b9c2-be5d99f02a38', subcategory: '포차/호프' },
  { id: '40304b2b-62ea-4fbc-b124-551ccdbf869f', subcategory: '포차/호프' },
  { id: '47686296-6dbc-4997-b653-fdbead83865d', subcategory: '포차/호프' },
  { id: '9120791a-1a2b-451f-b025-e92205178a1f', subcategory: '포차/호프' },
  { id: 'fe11b0d3-25f3-4a93-8744-487e1b9a3a20', subcategory: '포차/호프' },
  { id: '6b4a57f3-0a5f-4c86-8e4e-e53a215b4bd4', subcategory: '포차/호프' },
  { id: 'ca2b5d84-281c-4709-ab20-9c9f2034a3e1', subcategory: '포차/호프' },
  { id: '941d15b0-f3e0-4320-8551-1c3cdebd47bc', subcategory: '포차/호프' },
  { id: '8280f505-d363-4c77-b01e-e8281d187111', subcategory: '포차/호프' },
  // 분식
  { id: '5cae2585-66e6-4c2a-929a-e63f48e03164', subcategory: '분식' },
  { id: '6159b6e8-0c2c-43a0-b477-24ef8aff7149', subcategory: '분식' },
  { id: 'f97ec635-6f3d-48c3-9809-70de5cf29969', subcategory: '분식' },
  { id: 'aa4224c3-1837-4463-a23f-5f63989b86c6', subcategory: '분식' },
  { id: '77637b33-e305-4461-8f41-35f4be30b2ea', subcategory: '분식' },
  { id: 'f56373d7-9d27-48fe-8268-99a8a5ed9f1b', subcategory: '분식' },
  { id: '737af396-d114-475f-adf9-c6a206cf9dd1', subcategory: '분식' },
  { id: '72274624-7e39-44f1-aa8e-5d34d8786227', subcategory: '분식' },
  { id: 'eedbc6b4-85e6-482e-b5d0-967c6a26dff3', subcategory: '분식' },
  { id: '5b02300e-4fa9-416a-b7e0-79446ac300cf', subcategory: '분식' },
  { id: '3d9737cf-e803-41e8-83f7-ebc58048e367', subcategory: '분식' },
  { id: 'a5314050-7c66-4083-a55b-b741e90c270e', subcategory: '분식' },
  { id: '4755749d-bddc-46af-a429-d2854916d72b', subcategory: '분식' },
  { id: '800b1857-decc-4de8-8e14-bea6676a7b9a', subcategory: '분식' },
  { id: '1d8ffb91-c56c-4d33-ba41-d62bd5d7ad5c', subcategory: '분식' },
  { id: '56cbb354-a993-406a-9457-a973d2436ae3', subcategory: '분식' },
  { id: '7f6a2d54-38ea-4cbf-a5a0-c8d245d56198', subcategory: '분식' },
  { id: '5a9b3448-b716-400c-932a-6b1d2df2730a', subcategory: '분식' },
  // 족발/보쌈
  { id: 'b36fc20c-bbec-4e3a-af21-918fdbf83695', subcategory: '족발/보쌈' },
  { id: '7e168550-de3c-4094-a5e4-b093f66f1ad4', subcategory: '족발/보쌈' },
  { id: 'f2460d05-c663-461a-804a-5b81a1442905', subcategory: '족발/보쌈' },
  { id: '5397dfb1-778e-441f-a361-400af7f308b7', subcategory: '족발/보쌈' },
  { id: '7bf21497-2ddb-4f0e-9b54-a7ebeb1c0c53', subcategory: '족발/보쌈' },
  { id: '134928d5-edee-468e-a285-92a1455fff38', subcategory: '족발/보쌈' },
  // 국밥/찌개
  { id: '0dd70c68-fd0c-4d65-95be-2269cb08240e', subcategory: '국밥/찌개' },
  { id: '3bc9622b-0525-4cdc-93d4-5bb76555efab', subcategory: '국밥/찌개' },
  { id: '2ee54c0c-dc3e-427f-ba81-41fdc7e126c0', subcategory: '국밥/찌개' },
  { id: '5d361dfd-c6c5-406b-80fc-cef805217c9d', subcategory: '국밥/찌개' },
  { id: '87ee95cb-0c8f-4900-9d36-9638a30ee376', subcategory: '국밥/찌개' },
  { id: 'f22b2cdf-fed7-4f95-ba11-03346ba3b460', subcategory: '국밥/찌개' },
  { id: '1d27463c-7233-4ce3-99de-080e2a299cef', subcategory: '국밥/찌개' },
  { id: '5baf3679-ab98-4af5-b876-78dbbdc03995', subcategory: '국밥/찌개' },
  { id: '8967260f-e859-4da5-81fa-63380487734a', subcategory: '국밥/찌개' },
  { id: '2ab7488d-e404-47e7-9ca8-47c8eeea687b', subcategory: '국밥/찌개' },
  // 전골/샤브
  { id: '5d9526c7-c9e5-4ff6-8c64-3a8bc38b127c', subcategory: '전골/샤브' },
  { id: '77931d85-8b2e-4b34-bcba-6d3009752ce4', subcategory: '전골/샤브' },
  { id: '7e7b4ea1-6b3d-4609-9879-a1a1d70ba640', subcategory: '전골/샤브' },
  { id: 'ce803082-d831-45de-b0c4-6a0b82dffc3f', subcategory: '전골/샤브' },
  { id: '72d7021f-1048-4255-85a5-f56455e876c1', subcategory: '전골/샤브' },
  // 중화요리
  { id: '94afc584-759c-4df7-9a49-efb131b5ebc9', subcategory: '중화요리' },
  { id: 'bf75066c-a9d3-4b1b-b696-a059d432015c', subcategory: '중화요리' },
  { id: 'a8374bf5-7539-474b-bdd1-1e0e28c6cdc6', subcategory: '중화요리' },
  { id: 'd82d7dfb-5962-4773-a4f0-e06f3ea57cea', subcategory: '중화요리' },
  // 회/초밥
  { id: '6a60dfe5-e64a-45c5-85f3-663cfe680219', subcategory: '회/초밥' },
  { id: '6b4a57f3-0a5f-4c86-8e4e-e53a215b4bd4', subcategory: '회/초밥' },
];

async function main() {
  console.log(`총 ${UPDATES.length}개 subcategory 업데이트 시작...`);
  let success = 0;
  let fail = 0;
  for (const item of UPDATES) {
    const { error } = await supabase.from('businesses').update({ subcategory: item.subcategory }).eq('id', item.id);
    if (error) {
      console.error(`실패 [${item.id}]: ${error.message}`);
      fail++;
    } else {
      success++;
    }
  }
  console.log(`완료! 성공: ${success}개, 실패: ${fail}개`);
}

main().catch(console.error);