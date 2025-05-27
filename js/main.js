// Supabase 클라이언트 초기화
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// 사용자 인증 상태 확인
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        document.querySelector('.login-btn').textContent = '로그아웃'
        document.querySelector('.login-btn').href = '#'
        document.querySelector('.login-btn').addEventListener('click', handleLogout)
    }
}

// 로그아웃 처리
async function handleLogout(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signOut()
    if (!error) {
        window.location.href = 'index.html'
    }
}

// 페이지 로드 시 인증 상태 확인
document.addEventListener('DOMContentLoaded', checkAuth)

// 수업 예약 기능
async function bookClass(classId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        window.location.href = 'login.html'
        return
    }

    const { data, error } = await supabase
        .from('bookings')
        .insert([
            { 
                user_id: user.id,
                class_id: classId,
                booking_date: new Date()
            }
        ])

    if (error) {
        alert('예약 중 오류가 발생했습니다.')
    } else {
        alert('예약이 완료되었습니다!')
    }
}

// 트레이너 리뷰 작성
async function submitReview(trainerId, rating, comment) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        window.location.href = 'login.html'
        return
    }

    const { data, error } = await supabase
        .from('reviews')
        .insert([
            {
                user_id: user.id,
                trainer_id: trainerId,
                rating: rating,
                comment: comment,
                created_at: new Date()
            }
        ])

    if (error) {
        alert('리뷰 작성 중 오류가 발생했습니다.')
    } else {
        alert('리뷰가 등록되었습니다!')
        location.reload()
    }
}

// 문의하기 기능
async function submitContact(name, email, message) {
    const { data, error } = await supabase
        .from('contacts')
        .insert([
            {
                name: name,
                email: email,
                message: message,
                created_at: new Date()
            }
        ])

    if (error) {
        alert('문의 전송 중 오류가 발생했습니다.')
    } else {
        alert('문의가 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.')
        document.querySelector('form').reset()
    }
} 