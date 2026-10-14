import { replaceInFileSync } from 'replace-in-file';

try {
  const options = {
    files: 'src/generated/routes.ts',
    // Ищем импорты контроллеров, которые заканчиваются на кавычку без расширения
    from: /(import \{ .* \} from '[^']*\/controllers\/.*)(';)/g,
    // Дописываем .js перед закрывающей кавычкой
    to: "$1.js$2",
  };

  const results = replaceInFileSync(options);
  console.log(results);
  console.log('[🔧] Расширения .js успешно добавлены в сгенерированные маршруты tsoa');
} catch (error) {
  console.error('Ошибка при модификации файла маршрутов:', error);
}