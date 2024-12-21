import { MessageCircle, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm animate-pulse text-center md:text-left">
          Thông báo: Người chơi A đã tìm thấy kho báu!
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" size="sm" className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Chat hỗ trợ</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center" asChild>
            <a href="mailto:support@treasurehunt.com">
              <Mail className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Liên hệ</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}

