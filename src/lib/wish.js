export const DEFAULT_WISH = 'Chúc {name} ngày 20/10 thật rạng rỡ, luôn xinh đẹp và hạnh phúc! 🌸'

export function renderWish(template, name) {
  return template.replaceAll('{name}', name)
}

// Chọn ngẫu nhiên một mẫu và chèn tên; mẫu thiếu {name} thì thêm tiền tố
export function pickWish(templates, name, rand) {
  const list = templates?.length ? templates : [DEFAULT_WISH]
  let template = list[Math.floor(rand() * list.length)]
  if (!template.includes('{name}')) template = `{name} ơi, ${template}`
  return renderWish(template, name)
}
