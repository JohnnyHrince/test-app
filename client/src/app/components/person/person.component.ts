import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersonModalComponent } from './person-modal/person-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
    faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
    limit: number = 70; showBackTop: string = '';
    person: any = [];
  
    constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }
  
    ngOnInit(): void {
      this.loadData();
    }
    loadData = (): void => {
        this._spinner.show();
        axios.get('/api/person').then(({ data }) => {
          this.person = data;
          console.log("test", data);
          console.log("test1", this.person.car);
          this._spinner.hide();
        }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
      }

      addEdit = (id_person?: number): void => {
        const modalRef = this._modal.open(PersonModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
        modalRef.componentInstance.id_car = id_person;
        modalRef.closed.subscribe(() => {
          this.loadData();
        });
      }
    
      delete = (person: any): void => {
        const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
        modalRef.componentInstance.title = `Ștergere informație`;
        modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana cu numele <b>${person.full_name}</b>?`;
        modalRef.closed.subscribe(() => {
          axios.delete(`/api/person/${person.id}`).then(() => {
            this.toastr.success('Informația a fost ștearsă cu succes!');
            this.loadData();
          }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));
        });
      }
    
      onResize(): void {
        SET_HEIGHT('view', 20, 'height');
      }
    
      showTopButton(): void {
        if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
          this.showBackTop = 'show';
        } else {
          this.showBackTop = '';
        }
      }
    
      onScrollDown(): void {
        this.limit += 20;
      }
    
      onScrollTop(): void {
        SCROLL_TOP('view-scroll-informations', 0);
        this.limit = 70;
      }
}